import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MacroEvent, EventStatus, EventType } from './event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { SettlementService } from '../settlement/settlement.service';

@Injectable()
export class EventsService {
    constructor(
        @InjectRepository(MacroEvent)
        private readonly eventRepository: Repository<MacroEvent>,
        private readonly settlementService: SettlementService,
    ) { }

    async create(createEventDto: CreateEventDto): Promise<MacroEvent> {
        const event = this.eventRepository.create({
            ...createEventDto,
            releaseTime: new Date(createEventDto.releaseTime),
        });
        const savedEvent = await this.eventRepository.save(event);

        // 如果是 Shockwave，自动编排任务
        if (savedEvent.eventType === EventType.SHOCKWAVE) {
            await this.settlementService.scheduleShockwave(savedEvent.id, savedEvent.releaseTime);
        } else {
            // 普通事件，按原有逻辑 schedule (T+24h)
            await this.settlementService.scheduleSettlement(savedEvent.id, savedEvent.releaseTime);
        }

        return savedEvent;
    }

    async findAllActive(): Promise<MacroEvent[]> {
        return this.eventRepository.find({
            where: { status: EventStatus.UPCOMING },
            relations: ['options'],
        });
    }

    async findOne(id: string): Promise<MacroEvent> {
        const event = await this.eventRepository.findOne({
            where: { id },
            relations: ['options'],
        });
        if (!event) throw new NotFoundException('Event not found');
        return event;
    }

    /**
     * 计算 Pari-mutuel 实时赔率
     * 返回每个 subMode 下各选项的赔率
     */
    async calculatePariMutuelOdds(eventId: string): Promise<{
        dataSniper: Record<string, number>;
        volatilityHunter: Record<string, number>;
        jackpot: Record<string, number>;
    }> {
        const event = await this.findOne(eventId);
        const HOUSE_FEE = 0.05;

        const calculateOddsForMode = (options: typeof event.options) => {
            const totalPool = options.reduce((sum, o) => sum + Number(o.totalExposure), 0);
            const netPool = totalPool * (1 - HOUSE_FEE);

            const odds: Record<string, number> = {};
            for (const opt of options) {
                const exposure = Number(opt.totalExposure);
                // 如果该选项有投注，计算赔率；否则返回 0
                odds[opt.rangeLabel] = exposure > 0 ? Number((netPool / exposure).toFixed(2)) : 0;
            }
            return odds;
        };

        const dataSniperOptions = event.options.filter(o => o.subMode === 'DATA_SNIPER');
        const volOptions = event.options.filter(o => o.subMode === 'VOLATILITY_HUNTER');
        const jackpotOptions = event.options.filter(o => o.subMode === 'JACKPOT');

        return {
            dataSniper: calculateOddsForMode(dataSniperOptions),
            volatilityHunter: calculateOddsForMode(volOptions),
            jackpot: jackpotOptions.reduce((acc, opt) => {
                // Jackpot 使用固定赔率
                acc[opt.rangeLabel] = Number(opt.odds) || 0;
                return acc;
            }, {} as Record<string, number>),
        };
    }
}
