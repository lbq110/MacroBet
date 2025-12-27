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
}
