import { ShockwaveProcessor } from './shockwave.processor';

describe('ShockwaveProcessor', () => {
    let processor: ShockwaveProcessor;

    beforeEach(() => {
        // Create a mock processor instance for testing private methods
        processor = Object.create(ShockwaveProcessor.prototype);
    });

    describe('judgeDataSniper', () => {
        const createOption = (rangeLabel: string) => ({
            id: 'test',
            rangeLabel,
            rangeMin: null,
            rangeMax: null,
            subMode: 'DATA_SNIPER',
            odds: null,
            totalExposure: 0,
            isWinner: false,
        });

        it('should return true for DOVISH when actual < expected by more than margin', () => {
            const result = (processor as any).judgeDataSniper(3.0, 3.2, createOption('DOVISH'));
            expect(result).toBe(true);
        });

        it('should return true for HAWKISH when actual > expected by more than margin', () => {
            const result = (processor as any).judgeDataSniper(3.3, 3.1, createOption('HAWKISH'));
            expect(result).toBe(true);
        });

        it('should return true for NEUTRAL when actual ~= expected', () => {
            const result = (processor as any).judgeDataSniper(3.1, 3.105, createOption('NEUTRAL'));
            expect(result).toBe(true);
        });

        it('should return false for DOVISH when actual > expected', () => {
            const result = (processor as any).judgeDataSniper(3.3, 3.1, createOption('DOVISH'));
            expect(result).toBe(false);
        });
    });

    describe('judgeVolatility', () => {
        const createOption = (rangeLabel: string) => ({
            id: 'test',
            rangeLabel,
            rangeMin: null,
            rangeMax: null,
            subMode: 'VOLATILITY_HUNTER',
            odds: null,
            totalExposure: 0,
            isWinner: false,
        });

        it('should return WIN for CALM when delta < 200', () => {
            const result = (processor as any).judgeVolatility(95100, 95000, createOption('CALM'));
            expect(result).toBe('WIN');
        });

        it('should return WIN for TSUNAMI when delta >= 1000', () => {
            const result = (processor as any).judgeVolatility(96200, 95000, createOption('TSUNAMI'));
            expect(result).toBe('WIN');
        });

        it('should return REFUND for CALM when delta is in middle ground (200-1000)', () => {
            const result = (processor as any).judgeVolatility(95500, 95000, createOption('CALM'));
            expect(result).toBe('REFUND');
        });

        it('should return REFUND for TSUNAMI when delta is in middle ground (200-1000)', () => {
            const result = (processor as any).judgeVolatility(95500, 95000, createOption('TSUNAMI'));
            expect(result).toBe('REFUND');
        });

        it('should return LOSE for CALM when delta >= 1000', () => {
            const result = (processor as any).judgeVolatility(96500, 95000, createOption('CALM'));
            expect(result).toBe('LOSE');
        });

        it('should return LOSE for TSUNAMI when delta < 200', () => {
            const result = (processor as any).judgeVolatility(95050, 95000, createOption('TSUNAMI'));
            expect(result).toBe('LOSE');
        });
    });

    describe('judgeJackpot', () => {
        const createOption = (rangeMin: number | null, rangeMax: number | null) => ({
            id: 'test',
            rangeLabel: 'BTC > 98000',
            rangeMin,
            rangeMax,
            subMode: 'JACKPOT',
            odds: 50,
            totalExposure: 0,
            isWinner: false,
        });

        it('should return true when price is within range', () => {
            const result = (processor as any).judgeJackpot(97500, createOption(97000, 98000));
            expect(result).toBe(true);
        });

        it('should return false when price is below range', () => {
            const result = (processor as any).judgeJackpot(96500, createOption(97000, 98000));
            expect(result).toBe(false);
        });

        it('should return false when price is at or above rangeMax', () => {
            const result = (processor as any).judgeJackpot(98000, createOption(97000, 98000));
            expect(result).toBe(false);
        });

        it('should return true when only rangeMin is set and price >= rangeMin', () => {
            const result = (processor as any).judgeJackpot(99000, createOption(98000, null));
            expect(result).toBe(true);
        });
    });
});
