import type { Asset, MacroIndicator, BetOption, ShockwaveEvent } from '../types';
import { EventStatus, EventType, ShockwaveSubMode } from '../types';


export const MOCK_ASSETS: Asset[] = [
    // Crypto
    { id: 'btc', symbol: 'BTC', name: 'Bitcoin', category: 'Crypto', currentPrice: 94230.50, change24h: 2.34, lastUpdated: new Date().toISOString() },
    { id: 'eth', symbol: 'ETH', name: 'Ethereum', category: 'Crypto', currentPrice: 3420.80, change24h: 1.56, lastUpdated: new Date().toISOString() },
    { id: 'sol', symbol: 'SOL', name: 'Solana', category: 'Crypto', currentPrice: 198.45, change24h: 4.23, lastUpdated: new Date().toISOString() },

    // US Stocks
    { id: 'nvda', symbol: 'NVDA', name: 'NVIDIA', category: 'US Stocks', currentPrice: 890.45, change24h: 3.12, lastUpdated: new Date().toISOString() },
    { id: 'tsla', symbol: 'TSLA', name: 'Tesla', category: 'US Stocks', currentPrice: 248.50, change24h: -1.23, lastUpdated: new Date().toISOString() },
    { id: 'aapl', symbol: 'AAPL', name: 'Apple', category: 'US Stocks', currentPrice: 178.90, change24h: 0.45, lastUpdated: new Date().toISOString() },
    { id: 'googl', symbol: 'GOOGL', name: 'Google', category: 'US Stocks', currentPrice: 142.30, change24h: 0.89, lastUpdated: new Date().toISOString() },
    { id: 'msft', symbol: 'MSFT', name: 'Microsoft', category: 'US Stocks', currentPrice: 378.20, change24h: 0.67, lastUpdated: new Date().toISOString() },
    { id: 'amzn', symbol: 'AMZN', name: 'Amazon', category: 'US Stocks', currentPrice: 185.40, change24h: 1.12, lastUpdated: new Date().toISOString() },

    // Indices
    { id: 'spx500', symbol: 'SPX500', name: 'S&P 500', category: 'Indices', currentPrice: 5120.30, change24h: 0.45, lastUpdated: new Date().toISOString() },
    { id: 'us30', symbol: 'US30', name: 'Dow Jones', category: 'Indices', currentPrice: 42580.50, change24h: 0.32, lastUpdated: new Date().toISOString() },
    { id: 'nas100', symbol: 'NAS100', name: 'Nasdaq 100', category: 'Indices', currentPrice: 18920.40, change24h: 0.78, lastUpdated: new Date().toISOString() },
    { id: 'russ2000', symbol: 'RUSS2000', name: 'Russell 2000', category: 'Indices', currentPrice: 2245.60, change24h: -0.23, lastUpdated: new Date().toISOString() },
    { id: 'china50', symbol: 'CHINA50', name: 'China A50', category: 'Indices', currentPrice: 12450.30, change24h: 1.45, lastUpdated: new Date().toISOString() },
    { id: 'hk50', symbol: 'HK50', name: 'Hang Seng', category: 'Indices', currentPrice: 19870.20, change24h: 0.89, lastUpdated: new Date().toISOString() },
    { id: 'jpn225', symbol: 'JPN225', name: 'Nikkei 225', category: 'Indices', currentPrice: 38420.50, change24h: 0.56, lastUpdated: new Date().toISOString() },
    { id: 'vix', symbol: 'VIX', name: 'Volatility Index', category: 'Indices', currentPrice: 14.25, change24h: -2.34, lastUpdated: new Date().toISOString() },
    { id: 'usdx', symbol: 'USDX', name: 'US Dollar Index', category: 'Indices', currentPrice: 104.20, change24h: 0.05, lastUpdated: new Date().toISOString() },

    // HK Stocks
    { id: 'tencent', symbol: '0700.HK', name: 'Tencent', category: 'HK Stocks', currentPrice: 378.40, change24h: 1.23, lastUpdated: new Date().toISOString() },
    { id: 'baba', symbol: '9988.HK', name: 'Alibaba', category: 'HK Stocks', currentPrice: 85.60, change24h: -0.45, lastUpdated: new Date().toISOString() },
    { id: 'xiaomi', symbol: '1810.HK', name: 'Xiaomi', category: 'HK Stocks', currentPrice: 18.90, change24h: 2.34, lastUpdated: new Date().toISOString() },
    { id: '3750hk', symbol: '3750.HK', name: 'SH Electric', category: 'HK Stocks', currentPrice: 3.45, change24h: 0.12, lastUpdated: new Date().toISOString() },

    // Commodities
    { id: 'xauusd', symbol: 'XAUUSD', name: 'Gold', category: 'Commodities', currentPrice: 2340.50, change24h: -0.12, lastUpdated: new Date().toISOString() },
    { id: 'xagusd', symbol: 'XAGUSD', name: 'Silver', category: 'Commodities', currentPrice: 28.45, change24h: 0.56, lastUpdated: new Date().toISOString() },
    { id: 'xptusd', symbol: 'XPTUSD', name: 'Platinum', category: 'Commodities', currentPrice: 985.30, change24h: -0.34, lastUpdated: new Date().toISOString() },
    { id: 'xpdusd', symbol: 'XPDUSD', name: 'Palladium', category: 'Commodities', currentPrice: 1125.40, change24h: 1.23, lastUpdated: new Date().toISOString() },
    { id: 'usousd', symbol: 'USOUSD', name: 'US Oil', category: 'Commodities', currentPrice: 78.45, change24h: -1.56, lastUpdated: new Date().toISOString() },

    // Forex
    { id: 'usdcnh', symbol: 'USDCNH', name: 'USD/CNH', category: 'Forex', currentPrice: 7.2845, change24h: 0.12, lastUpdated: new Date().toISOString() },
    { id: 'eurusd', symbol: 'EURUSD', name: 'EUR/USD', category: 'Forex', currentPrice: 1.0845, change24h: -0.23, lastUpdated: new Date().toISOString() },
    { id: 'usdjpy', symbol: 'USDJPY', name: 'USD/JPY', category: 'Forex', currentPrice: 157.45, change24h: 0.34, lastUpdated: new Date().toISOString() },
    { id: 'audusd', symbol: 'AUDUSD', name: 'AUD/USD', category: 'Forex', currentPrice: 0.6245, change24h: -0.45, lastUpdated: new Date().toISOString() },
    { id: 'gbpusd', symbol: 'GBPUSD', name: 'GBP/USD', category: 'Forex', currentPrice: 1.2545, change24h: 0.12, lastUpdated: new Date().toISOString() },
];

export const MOCK_ASSET = MOCK_ASSETS[0];

export const MOCK_MACRO_DATA: MacroIndicator[] = [
    {
        id: 'cpi',
        name: 'CPI (YoY)',
        category: 'Inflation',
        importance: 3,
        frequency: 'Monthly',
        lastRelease: '2025-12-10',
        nextRelease: '2026-01-12',
        reactions: {
            'Above Expectation': {
                label: 'Above Expectation',
                avgChange: -2.1,
                medianChange: -1.8,
                upCount: 12,
                downCount: 48,
                upProbability: 20,
                downProbability: 80,
                volatilityAmplitude: 1.5,
                sampleSize: 60,
                history: [
                    { date: '2025-11-10', actual: '3.4%', forecast: '3.1%', priceChange: -2.5 },
                    { date: '2025-08-10', actual: '3.2%', forecast: '3.0%', priceChange: -1.2 },
                ]
            },
            'In Line': {
                label: 'In Line',
                avgChange: 0.5,
                medianChange: 0.2,
                upCount: 22,
                downCount: 18,
                upProbability: 55,
                downProbability: 45,
                volatilityAmplitude: 0.4,
                sampleSize: 40,
                history: []
            },
            'Below Expectation': {
                label: 'Below Expectation',
                avgChange: 3.2,
                medianChange: 2.9,
                upCount: 68,
                downCount: 12,
                upProbability: 85,
                downProbability: 15,
                volatilityAmplitude: 2.1,
                sampleSize: 80,
                history: []
            }
        }
    },
    {
        id: 'nfp',
        name: 'Non-Farm Payrolls',
        category: 'Employment',
        importance: 3,
        frequency: 'Monthly',
        lastRelease: '2025-12-05',
        nextRelease: '2026-01-08',
        reactions: {
            'Above Expectation': {
                label: 'Above Expectation',
                avgChange: 1.5,
                medianChange: 1.2,
                upCount: 52,
                downCount: 28,
                upProbability: 65,
                downProbability: 35,
                volatilityAmplitude: 1.2,
                sampleSize: 80,
                history: []
            },
            'In Line': {
                label: 'In Line',
                avgChange: -0.2,
                medianChange: -0.1,
                upCount: 36,
                downCount: 44,
                upProbability: 45,
                downProbability: 55,
                volatilityAmplitude: 0.3,
                sampleSize: 80,
                history: []
            },
            'Below Expectation': {
                label: 'Below Expectation',
                avgChange: -1.8,
                medianChange: -1.5,
                upCount: 24,
                downCount: 56,
                upProbability: 30,
                downProbability: 70,
                volatilityAmplitude: 1.4,
                sampleSize: 80,
                history: []
            }
        }
    },
    {
        id: 'fomc',
        name: 'FOMC Rate Decision',
        category: 'Monetary Policy',
        importance: 3,
        frequency: '8 times/yr',
        lastRelease: '2025-12-15',
        nextRelease: '2026-02-01',
        reactions: {
            'Above Expectation': {
                label: 'Above Expectation',
                avgChange: -4.5,
                medianChange: -4.0,
                upCount: 8,
                downCount: 72,
                upProbability: 10,
                downProbability: 90,
                volatilityAmplitude: 3.5,
                sampleSize: 80,
                history: []
            },
            'In Line': {
                label: 'In Line',
                avgChange: 0.0,
                medianChange: 0.0,
                upCount: 40,
                downCount: 40,
                upProbability: 50,
                downProbability: 50,
                volatilityAmplitude: 0.5,
                sampleSize: 80,
                history: []
            },
            'Below Expectation': {
                label: 'Below Expectation',
                avgChange: 5.2,
                medianChange: 4.8,
                upCount: 72,
                downCount: 8,
                upProbability: 90,
                downProbability: 10,
                volatilityAmplitude: 4.2,
                sampleSize: 80,
                history: []
            }
        }
    }
];



export const MOCK_BETS: BetOption[] = [
    // UP Bets
    { id: 'u1', direction: 'UP', rangeLabel: '+0% ~ +1%', odds: 2.1, historicalWinRate: 45 },
    { id: 'u2', direction: 'UP', rangeLabel: '+1% ~ +3%', odds: 3.5, historicalWinRate: 25 },
    { id: 'u3', direction: 'UP', rangeLabel: '> +3%', odds: 8.0, historicalWinRate: 10 },
    // DOWN Bets
    { id: 'd1', direction: 'DOWN', rangeLabel: '-0% ~ -1%', odds: 2.1, historicalWinRate: 45 },
    { id: 'd2', direction: 'DOWN', rangeLabel: '-1% ~ -3%', odds: 3.5, historicalWinRate: 25 },
    { id: 'd3', direction: 'DOWN', rangeLabel: '> -3%', odds: 8.0, historicalWinRate: 10 },
];

export const MOCK_SHOCKWAVE_EVENT: ShockwaveEvent = {
    id: 'cpi-sw-001',
    indicatorName: 'CPI',
    releaseTime: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(), // 2 hours from now
    expectedValue: 3.1,
    status: EventStatus.BETTING,
    eventType: EventType.SHOCKWAVE,
    basePrice: 95420.50,
    options: [
        { id: 's1', rangeLabel: 'DOVISH', subMode: ShockwaveSubMode.DATA_SNIPER },
        { id: 's2', rangeLabel: 'NEUTRAL', subMode: ShockwaveSubMode.DATA_SNIPER },
        { id: 's3', rangeLabel: 'HAWKISH', subMode: ShockwaveSubMode.DATA_SNIPER },
        { id: 'v1', rangeLabel: 'CALM', subMode: ShockwaveSubMode.VOLATILITY_HUNTER },
        { id: 'v2', rangeLabel: 'TSUNAMI', subMode: ShockwaveSubMode.VOLATILITY_HUNTER },
        { id: 'j1', rangeLabel: 'BTC > $98,000', subMode: ShockwaveSubMode.JACKPOT, odds: 50 },
        { id: 'j2', rangeLabel: 'BTC $97k-$98k', subMode: ShockwaveSubMode.JACKPOT, odds: 20 },
        { id: 'j3', rangeLabel: 'BTC $96k-$97k', subMode: ShockwaveSubMode.JACKPOT, odds: 10 },
        { id: 'j4', rangeLabel: 'BTC $95k-$96k', subMode: ShockwaveSubMode.JACKPOT, odds: 5 },
    ]
};
