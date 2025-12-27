import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceReactionStat } from './entities/price-reaction-stat.entity';
import { MacroIndicator } from './entities/macro-indicator.entity';
import { StatisticsService } from './statistics.service';

@Module({
    imports: [TypeOrmModule.forFeature([PriceReactionStat, MacroIndicator])],
    providers: [StatisticsService],
    exports: [StatisticsService],
})
export class StatisticsModule { }
