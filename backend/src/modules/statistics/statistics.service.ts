import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriceReactionStat, ResultType } from './entities/price-reaction-stat.entity';
import { MacroIndicator } from './entities/macro-indicator.entity';

@Injectable()
export class StatisticsService {
    private readonly logger = new Logger(StatisticsService.name);

    constructor(
        @InjectRepository(PriceReactionStat)
        private statsRepo: Repository<PriceReactionStat>,
        @InjectRepository(MacroIndicator)
        private indicatorRepo: Repository<MacroIndicator>,
    ) { }

    /**
     * Pipeline Step: Aggregation and Win Rate Calculation
     * 
     * @param assetId Asset to analyze (e.g. 'BTC')
     * @param indicatorId Macro indicator ID
     */
    async updateHistoricalStats(assetId: string, indicatorId: string): Promise<void> {
        this.logger.log(`Starting stats update for ${assetId} on indicator ${indicatorId}`);

        // 1. Fetch all historical events for this indicator
        // 2. Align with price data (VWAP at T0 and T+window)
        // 3. Winsorize returns to handle outliers
        // 4. Calculate AVG, MEDIAN, WIN_RATE
        // 5. Update price_reaction_stats table
    }

    /**
     * Helper: Winsorize data to remove outliers (1% & 99% percentile)
     */
    private winsorize(data: number[], limits: [number, number]): number[] {
        if (data.length < 10) return data;

        const sorted = [...data].sort((a, b) => a - b);
        const lowIdx = Math.floor(sorted.length * limits[0]);
        const highIdx = Math.ceil(sorted.length * (1 - limits[1])) - 1;

        const lowVal = sorted[lowIdx];
        const highVal = sorted[highIdx];

        return data.map(v => Math.max(lowVal, Math.min(highVal, v)));
    }
}
