import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';
import { MacroEvent, EventStatus } from '../../events/event.entity';
import { Bet, BetStatus } from '../../bets/bet.entity';
import { BetOption } from '../../events/bet-option.entity';
import { User } from '../../users/user.entity';

@Processor('settlement')
export class SettlementProcessor {
    private readonly logger = new Logger(SettlementProcessor.name);

    constructor(
        @InjectRepository(MacroEvent) private readonly eventRepository: Repository<MacroEvent>,
        @InjectRepository(Bet) private readonly betRepository: Repository<Bet>,
        private readonly dataSource: DataSource,
    ) { }

    @Process('process-settlement')
    async handleSettlement(job: Job<{ eventId: string }>) {
        const { eventId } = job.data;
        this.logger.log(`Starting settlement for event: ${eventId}`);

        const event = await this.eventRepository.findOne({
            where: { id: eventId },
            relations: ['options'],
        });

        if (!event || event.status === EventStatus.SETTLED) {
            this.logger.warn(`Event ${eventId} not found or already settled.`);
            return;
        }

        // In a real scenario, we'd fetch actual price delta here.
        // Mocking winning range determination:
        const mockDelta = 0.0075; // 0.75% pump
        const winningOption = event.options.find(
            (opt) =>
                (opt.rangeMin === null || mockDelta >= opt.rangeMin) &&
                (opt.rangeMax === null || mockDelta < opt.rangeMax),
        );

        if (!winningOption) {
            this.logger.error(`No winning option found for event ${eventId} with delta ${mockDelta}`);
            return;
        }

        await this.dataSource.transaction(async (manager) => {
            // 1. Mark winners and losers
            winningOption.isWinner = true;
            await manager.save(winningOption);

            const bets = await manager.find(Bet, {
                where: { option: { event: { id: eventId } } },
                relations: ['user', 'option'],
            });

            for (const bet of bets) {
                if (bet.option.id === winningOption.id) {
                    bet.status = BetStatus.WON;
                    const payout = Number(bet.amount) * Number(bet.payoutOdds);

                    // Credit user
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

            // 2. Finalize event
            event.status = EventStatus.SETTLED;
            await manager.save(event);
        });

        this.logger.log(`Settlement completed for event: ${eventId}`);
    }
}
