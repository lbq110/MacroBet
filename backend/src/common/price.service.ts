import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PriceService {
    private readonly logger = new Logger(PriceService.name);

    /**
     * 获取指定时间窗口的 TWAP (时间加权平均价)
     * 在生产环境中，这将从价格数据库或 External API 获取。
     */
    async getTwap(assetSymbol: string, startTime: Date, durationSeconds: number): Promise<number> {
        this.logger.log(`Fetching Twap for ${assetSymbol} starting at ${startTime.toISOString()} for ${durationSeconds}s`);

        // Mock 逻辑: 模拟一个基准价和一点波动
        const basePrice = assetSymbol === 'BTC' ? 95000 : 1.0;

        // 模拟 CPI 后的波动：如果在 8:30:00 之后不久，波动性增加
        const isShockTime = startTime.getHours() === 8 && startTime.getMinutes() === 30;
        const volatility = isShockTime ? 500 : 50;

        const mockPrice = basePrice + (Math.random() - 0.5) * volatility;

        return Number(mockPrice.toFixed(2));
    }

    /**
     * 获取最新的资产价格
     */
    async getLatestPrice(assetSymbol: string): Promise<number> {
        return this.getTwap(assetSymbol, new Date(), 1);
    }
}
