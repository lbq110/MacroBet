import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Logger } from '@nestjs/common';
import { MacroEvent, EventStatus, EventType } from '../../events/event.entity';
import { Bet, BetStatus } from '../../bets/bet.entity';
import { BetOption, ShockwaveSubMode } from '../../events/bet-option.entity';
import { User } from '../../users/user.entity';
import { PriceService } from '../../../common/price.service';

@Processor('settlement')
export class ShockwaveProcessor {
    private readonly logger = new Logger(ShockwaveProcessor.name);

    constructor(
        @InjectRepository(MacroEvent) private readonly eventRepository: Repository<MacroEvent>,
        @InjectRepository(Bet) private readonly betRepository: Repository<Bet>,
        private readonly dataSource: DataSource,
        private readonly priceService: PriceService,
    ) { }

    @Process('process-shockwave-stages')
    async handleShockwaveStages(job: Job<{ eventId: string, stage: 'BETTING' | 'LOCKED' | 'T0' | 'T5' }>) {
        const { eventId, stage } = job.data;
        const event = await this.eventRepository.findOne({ where: { id: eventId } });

        if (!event || event.eventType !== EventType.SHOCKWAVE) return;

        if (stage === 'BETTING') {
            await this.handleBetting(event);
        } else if (stage === 'LOCKED') {
            await this.handleLocked(event);
        } else if (stage === 'T0') {
            await this.handleT0(event);
        } else if (stage === 'T5') {
            await this.handleT5(event);
        }
    }

    /**
     * BETTING 阶段 (8:00): 开放投注，允许撤单
     */
    private async handleBetting(event: MacroEvent) {
        this.logger.log(`Shockwave BETTING: Opening bets for event ${event.id}`);
        event.status = EventStatus.BETTING;
        await this.eventRepository.save(event);
    }

    /**
     * LOCKED 阶段 (8:15): 锁定投注，禁止撤单
     */
    private async handleLocked(event: MacroEvent) {
        this.logger.log(`Shockwave LOCKED: Locking bets for event ${event.id}`);
        event.status = EventStatus.LOCKED;
        await this.eventRepository.save(event);
    }

    /**
     * T0 阶段 (8:30): 记录基准价，更新状态为 LIVE
     */
    private async handleT0(event: MacroEvent) {
        this.logger.log(`Shockwave T0: Recording base price for event ${event.id}`);

        // 取 T0 前后 15 秒的 TWAP
        const basePrice = await this.priceService.getTwap('BTC', event.releaseTime, 15);

        event.basePrice = basePrice;
        event.status = EventStatus.LIVE;
        await this.eventRepository.save(event);

        this.logger.log(`Shockwave T0 Complete. Base Price: ${basePrice}. Status: LIVE`);
    }

    /**
     * T+5m 阶段 (8:35): 记录结算价，判定三重博弈结果并派奖
     */
    private async handleT5(event: MacroEvent) {
        this.logger.log(`Shockwave T5: Settling event ${event.id}`);

        const settleTime = new Date(event.releaseTime.getTime() + 5 * 60 * 1000);
        const settlePrice = await this.priceService.getTwap('BTC', settleTime, 15);

        // 获取实际宏观值 (模拟)
        // 在真实场景中，这里应调用第三方 API 或数据库中的最新 ActualValue
        const actualValue = event.actualValue || (event.expectedValue + (Math.random() - 0.5) * 0.4);

        await this.dataSource.transaction(async (manager) => {
            // 1. 更新事件状态
            event.settlePrice = settlePrice;
            event.actualValue = actualValue;
            event.status = EventStatus.SETTLING;
            await manager.save(event);

            // 2. 判定每个 Option 的赢家
            const options = await manager.find(BetOption, { where: { event: { id: event.id } } });
            const winners: BetOption[] = [];

            for (const opt of options) {
                let isWinner = false;

                if (opt.subMode === ShockwaveSubMode.DATA_SNIPER) {
                    isWinner = this.judgeDataSniper(actualValue, event.expectedValue, opt);
                } else if (opt.subMode === ShockwaveSubMode.VOLATILITY_HUNTER) {
                    const volResult = this.judgeVolatility(settlePrice, Number(event.basePrice), opt);
                    if (volResult === 'REFUND') {
                        // 中间地带：标记为需要退款
                        opt.isWinner = false;
                        (opt as any).needRefund = true;
                    } else {
                        isWinner = volResult === 'WIN';
                    }
                } else if (opt.subMode === ShockwaveSubMode.JACKPOT) {
                    isWinner = this.judgeJackpot(settlePrice, opt);
                }

                if (isWinner) {
                    opt.isWinner = true;
                    winners.push(opt);
                }
                await manager.save(opt);
            }

            // 3. 计算 Pari-mutuel 赔率并派奖
            // 我们按 subMode 分组派奖，每个 Pool (A/B/C) 独立计算
            const subModes = [ShockwaveSubMode.DATA_SNIPER, ShockwaveSubMode.VOLATILITY_HUNTER, ShockwaveSubMode.JACKPOT];

            for (const mode of subModes) {
                const modeOptions = options.filter(o => o.subMode === mode);
                const modeWinners = modeOptions.filter(o => o.isWinner);

                const totalPool = modeOptions.reduce((sum, o) => sum + Number(o.totalExposure), 0);
                const winnerPool = modeWinners.reduce((sum, o) => sum + Number(o.totalExposure), 0);

                if (totalPool === 0) continue;

                // 计算该池的最终赔率 (简单 Pari-mutuel: Pool / WinnerPool)
                // 实际应减去 House Fee
                const houseFee = 0.05;
                const netPool = totalPool * (1 - houseFee);
                const finalOdds = winnerPool > 0 ? netPool / winnerPool : 0;

                const bets = await manager.find(Bet, {
                    where: { option: { id: In(modeOptions.map(o => o.id)) } },
                    relations: ['user', 'option']
                });

                for (const bet of bets) {
                    // 检查是否需要退款（Volatility Hunter 中间地带）
                    const optNeedRefund = (bet.option as any).needRefund;

                    if (optNeedRefund) {
                        bet.status = BetStatus.REFUNDED;
                        // 全额退款
                        const user = await manager.findOne(User, { where: { id: bet.user.id }, lock: { mode: 'pessimistic_write' } });
                        if (user) {
                            user.balance = Number(user.balance) + Number(bet.amount);
                            await manager.save(user);
                        }
                    } else if (bet.option.isWinner) {
                        bet.status = BetStatus.WON;
                        bet.payoutOdds = finalOdds;
                        const payout = Number(bet.amount) * finalOdds;

                        const user = await manager.findOne(User, { where: { id: bet.user.id }, lock: { mode: 'pessimistic_write' } });
                        if (user) {
                            user.balance = Number(user.balance) + payout;
                            await manager.save(user);
                        }
                    } else {
                        bet.status = BetStatus.LOST;
                    }
                    bet.settledAt = new Date();
                    await manager.save(bet);
                }
            }

            event.status = EventStatus.SETTLED;
            await manager.save(event);
        });

        this.logger.log(`Shockwave Settlement Complete for event ${event.id}`);
    }

    private judgeDataSniper(actual: number, forecast: number, opt: BetOption): boolean {
        const diff = actual - forecast;
        const margin = 0.01; // 阈值

        if (opt.rangeLabel === 'DOVISH') return diff < -margin;
        if (opt.rangeLabel === 'HAWKISH') return diff > margin;
        if (opt.rangeLabel === 'NEUTRAL') return Math.abs(diff) <= margin;
        return false;
    }

    private judgeVolatility(settle: number, base: number, opt: BetOption): 'WIN' | 'LOSE' | 'REFUND' {
        const delta = Math.abs(settle - base);
        const CALM_THRESHOLD = 200;
        const TSUNAMI_THRESHOLD = 1000;

        if (opt.rangeLabel === 'TSUNAMI') {
            if (delta >= TSUNAMI_THRESHOLD) return 'WIN';
            if (delta < CALM_THRESHOLD) return 'LOSE';
            return 'REFUND'; // 中间地带
        }
        if (opt.rangeLabel === 'CALM') {
            if (delta < CALM_THRESHOLD) return 'WIN';
            if (delta >= TSUNAMI_THRESHOLD) return 'LOSE';
            return 'REFUND'; // 中间地带
        }
        return 'LOSE';
    }

    private judgeJackpot(settle: number, opt: BetOption): boolean {
        const s = Number(settle);
        return (opt.rangeMin === null || s >= Number(opt.rangeMin)) &&
            (opt.rangeMax === null || s < Number(opt.rangeMax));
    }
}
