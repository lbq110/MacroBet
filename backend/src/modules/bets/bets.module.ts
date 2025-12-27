import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bet } from './bet.entity';
import { BetOption } from '../events/bet-option.entity';
import { User } from '../users/user.entity';
import { MacroEvent } from '../events/event.entity';
import { BetsService } from './bets.service';
import { BetsController } from './bets.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Bet, BetOption, User, MacroEvent])],
    controllers: [BetsController],
    providers: [BetsService],
    exports: [BetsService],
})
export class BetsModule { }
