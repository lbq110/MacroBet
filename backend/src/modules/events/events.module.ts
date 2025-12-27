import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MacroEvent } from './event.entity';
import { BetOption } from './bet-option.entity';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { SettlementModule } from '../settlement/settlement.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([MacroEvent, BetOption]),
        SettlementModule,
    ],
    controllers: [EventsController],
    providers: [EventsService],
    exports: [EventsService],
})
export class EventsModule { }
