import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettlementService } from './settlement.service';
import { SettlementProcessor } from './processors/settlement.processor';
import { ShockwaveProcessor } from './processors/shockwave.processor';
import { Bet } from '../bets/bet.entity';
import { BetOption } from '../events/bet-option.entity';
import { User } from '../users/user.entity';
import { MacroEvent } from '../events/event.entity';
import { PriceService } from '../../common/price.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Bet, BetOption, User, MacroEvent]),
        BullModule.registerQueue({
            name: 'settlement',
        }),
    ],
    providers: [SettlementService, SettlementProcessor, ShockwaveProcessor, PriceService],
    exports: [SettlementService],
})
export class SettlementModule { }
