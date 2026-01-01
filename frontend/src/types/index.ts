export interface Asset {
  id: string;
  symbol: string;
  name: string;
  category?: string; // Crypto, US Stocks, Indices, HK Stocks, Commodities, Forex
  currentPrice: number;
  change24h: number; // Percentage, e.g., 2.5 for +2.5%
  lastUpdated: string;
}

export type ImpactType = 'Above Expectation' | 'In Line' | 'Below Expectation';

export interface PriceReaction {
  label: ImpactType;
  avgChange: number; // %
  medianChange: number; // %
  upCount: number;
  downCount: number;
  upProbability: number; // 0-100
  downProbability: number; // 0-100
  volatilityAmplitude: number; // % or absolute
  sampleSize: number;
  history: {
    date: string;
    actual: string;
    forecast: string;
    priceChange: number;
  }[];
}


export interface MacroIndicator {
  id: string;
  name: string; // e.g., CPI, NFP
  category: string; // e.g., "Inflation", "Employment", "Monetary"
  importance: number; // 1-3 stars
  frequency: string; // e.g., "Monthly"
  lastRelease: string;
  nextRelease?: string;
  reactions: Record<ImpactType, PriceReaction>;
}

export type EventType = 'REGULAR' | 'SHOCKWAVE';
export const EventType = {
  REGULAR: 'REGULAR' as const,
  SHOCKWAVE: 'SHOCKWAVE' as const,
};

export type EventStatus = 'UPCOMING' | 'BETTING' | 'LOCKED' | 'LIVE' | 'SETTLING' | 'SETTLED' | 'CANCELLED';
export const EventStatus = {
  UPCOMING: 'UPCOMING' as const,
  BETTING: 'BETTING' as const,
  LOCKED: 'LOCKED' as const,
  LIVE: 'LIVE' as const,
  SETTLING: 'SETTLING' as const,
  SETTLED: 'SETTLED' as const,
  CANCELLED: 'CANCELLED' as const,
};

export type ShockwaveSubMode = 'DATA_SNIPER' | 'VOLATILITY_HUNTER' | 'JACKPOT';
export const ShockwaveSubMode = {
  DATA_SNIPER: 'DATA_SNIPER' as const,
  VOLATILITY_HUNTER: 'VOLATILITY_HUNTER' as const,
  JACKPOT: 'JACKPOT' as const,
};

export interface ShockwaveEvent {
  id: string;
  indicatorName: string;
  releaseTime: string;
  expectedValue: number;
  actualValue?: number;
  status: EventStatus;
  eventType: EventType;
  basePrice?: number;
  settlePrice?: number;
  options: BetOption[];
}


export interface BetOption {
  id: string;
  direction?: 'UP' | 'DOWN';
  rangeLabel: string; // e.g., "+0% ~ 1%"
  odds?: number; // e.g., 2.5 (null for dynamic)
  historicalWinRate?: number; // 0-100
  subMode?: ShockwaveSubMode;
  totalExposure?: number;
}
