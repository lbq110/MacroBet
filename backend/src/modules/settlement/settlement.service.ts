import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';


@Injectable()
export class SettlementService {
    private readonly logger = new Logger(SettlementService.name);

    constructor(@InjectQueue('settlement') private readonly settlementQueue: Queue) { }

    async scheduleSettlement(eventId: string, releaseTime: Date, window: '30m' | '24h' = '24h') {
        const windowMs = window === '30m' ? 30 * 60 * 1000 : 24 * 60 * 60 * 1000;
        const settlementTime = new Date(releaseTime.getTime() + windowMs);
        const delay = Math.max(0, settlementTime.getTime() - Date.now());

        this.logger.log(`Scheduling ${window} settlement for event ${eventId} in ${delay}ms`);

        await this.settlementQueue.add(
            'process-settlement',
            { eventId, window },
            { delay, removeOnComplete: true },
        );
    }

    /**
     * 为 Shockwave 模式编排两个阶段的任务：T0 (8:30) 和 T5 (8:35)
     */
    async scheduleShockwave(eventId: string, releaseTime: Date) {
        const now = Date.now();

        // 1. Betting 阶段任务 (8:00)
        const delayBetting = Math.max(0, releaseTime.getTime() - 30 * 60 * 1000 - now);
        await this.settlementQueue.add(
            'process-shockwave-stages',
            { eventId, stage: 'BETTING' },
            { delay: delayBetting, removeOnComplete: true }
        );

        // 2. Locked 阶段任务 (8:15)
        const delayLocked = Math.max(0, releaseTime.getTime() - 15 * 60 * 1000 - now);
        await this.settlementQueue.add(
            'process-shockwave-stages',
            { eventId, stage: 'LOCKED' },
            { delay: delayLocked, removeOnComplete: true }
        );

        // 3. T0 任务 (8:30)
        const delayT0 = Math.max(0, releaseTime.getTime() - now);
        await this.settlementQueue.add(
            'process-shockwave-stages',
            { eventId, stage: 'T0' },
            { delay: delayT0, removeOnComplete: true }
        );

        // 4. T5 任务 (8:35)
        const delayT5 = Math.max(0, releaseTime.getTime() + 5 * 60 * 1000 - now);
        await this.settlementQueue.add(
            'process-shockwave-stages',
            { eventId, stage: 'T5' },
            { delay: delayT5, removeOnComplete: true }
        );

        this.logger.log(`Scheduled all Shockwave stages for event ${eventId}`);
    }

}
