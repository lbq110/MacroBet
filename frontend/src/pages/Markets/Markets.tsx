import { useState } from 'react';
import { Bitcoin, TrendingUp, Bookmark, DollarSign, BarChart2, Building2, Gem, Globe } from 'lucide-react';
import { CryptoBetting } from '../CryptoBetting/CryptoBetting';
import './Markets.css';

// Market category types
type MarketCategory = 'all' | 'crypto' | 'us_stocks' | 'indices' | 'hk_stocks' | 'commodities' | 'forex';

interface MarketItem {
    id: string;
    symbol: string;
    name: string;
    category: MarketCategory;
    up: number;
    down: number;
    isLive: boolean;
    volume: number;
}

// Generate random odds for demo
const randomOdds = () => {
    const up = Math.round((0.3 + Math.random() * 0.4) * 100) / 100;
    return { up, down: Math.round((1 - up) * 100) / 100 };
};

// All market data
const MARKETS: MarketItem[] = [
    // Crypto
    { id: 'btc', symbol: 'BTC', name: 'Bitcoin', category: 'crypto', ...randomOdds(), isLive: true, volume: 84500 },
    { id: 'eth', symbol: 'ETH', name: 'Ethereum', category: 'crypto', ...randomOdds(), isLive: true, volume: 62300 },
    { id: 'sol', symbol: 'SOL', name: 'Solana', category: 'crypto', ...randomOdds(), isLive: true, volume: 31200 },

    // US Stocks
    { id: 'nvda', symbol: 'NVDA', name: 'NVIDIA', category: 'us_stocks', ...randomOdds(), isLive: true, volume: 156000 },
    { id: 'tsla', symbol: 'TSLA', name: 'Tesla', category: 'us_stocks', ...randomOdds(), isLive: true, volume: 142000 },
    { id: 'aapl', symbol: 'AAPL', name: 'Apple', category: 'us_stocks', ...randomOdds(), isLive: true, volume: 98000 },
    { id: 'googl', symbol: 'GOOGL', name: 'Google', category: 'us_stocks', ...randomOdds(), isLive: true, volume: 87000 },
    { id: 'msft', symbol: 'MSFT', name: 'Microsoft', category: 'us_stocks', ...randomOdds(), isLive: true, volume: 76000 },
    { id: 'amzn', symbol: 'AMZN', name: 'Amazon', category: 'us_stocks', ...randomOdds(), isLive: true, volume: 65000 },

    // Indices
    { id: 'spx500', symbol: 'SPX500', name: 'S&P 500', category: 'indices', ...randomOdds(), isLive: true, volume: 245000 },
    { id: 'us30', symbol: 'US30', name: 'Dow Jones', category: 'indices', ...randomOdds(), isLive: true, volume: 189000 },
    { id: 'nas100', symbol: 'NAS100', name: 'Nasdaq 100', category: 'indices', ...randomOdds(), isLive: true, volume: 167000 },
    { id: 'russ2000', symbol: 'RUSS2000', name: 'Russell 2000', category: 'indices', ...randomOdds(), isLive: true, volume: 54000 },
    { id: 'china50', symbol: 'CHINA50', name: 'China A50', category: 'indices', ...randomOdds(), isLive: true, volume: 78000 },
    { id: 'hk50', symbol: 'HK50', name: 'Hang Seng', category: 'indices', ...randomOdds(), isLive: true, volume: 92000 },
    { id: 'jpn225', symbol: 'JPN225', name: 'Nikkei 225', category: 'indices', ...randomOdds(), isLive: true, volume: 68000 },
    { id: 'vix', symbol: 'VIX', name: 'Volatility Index', category: 'indices', ...randomOdds(), isLive: true, volume: 123000 },
    { id: 'usdx', symbol: 'USDX', name: 'US Dollar Index', category: 'indices', ...randomOdds(), isLive: true, volume: 45000 },

    // HK Stocks
    { id: 'tencent', symbol: '0700.HK', name: 'Tencent', category: 'hk_stocks', ...randomOdds(), isLive: true, volume: 156000 },
    { id: 'baba', symbol: '9988.HK', name: 'Alibaba', category: 'hk_stocks', ...randomOdds(), isLive: true, volume: 134000 },
    { id: 'xiaomi', symbol: '1810.HK', name: 'Xiaomi', category: 'hk_stocks', ...randomOdds(), isLive: true, volume: 67000 },
    { id: '3750hk', symbol: '3750.HK', name: 'SH Electric', category: 'hk_stocks', ...randomOdds(), isLive: true, volume: 23000 },

    // Commodities
    { id: 'xauusd', symbol: 'XAUUSD', name: 'Gold', category: 'commodities', ...randomOdds(), isLive: true, volume: 234000 },
    { id: 'xagusd', symbol: 'XAGUSD', name: 'Silver', category: 'commodities', ...randomOdds(), isLive: true, volume: 98000 },
    { id: 'xptusd', symbol: 'XPTUSD', name: 'Platinum', category: 'commodities', ...randomOdds(), isLive: true, volume: 45000 },
    { id: 'xpdusd', symbol: 'XPDUSD', name: 'Palladium', category: 'commodities', ...randomOdds(), isLive: true, volume: 32000 },
    { id: 'usousd', symbol: 'USOUSD', name: 'US Oil', category: 'commodities', ...randomOdds(), isLive: true, volume: 187000 },

    // Forex
    { id: 'usdcnh', symbol: 'USDCNH', name: 'USD/CNH', category: 'forex', ...randomOdds(), isLive: true, volume: 156000 },
    { id: 'eurusd', symbol: 'EURUSD', name: 'EUR/USD', category: 'forex', ...randomOdds(), isLive: true, volume: 289000 },
    { id: 'usdjpy', symbol: 'USDJPY', name: 'USD/JPY', category: 'forex', ...randomOdds(), isLive: true, volume: 245000 },
    { id: 'audusd', symbol: 'AUDUSD', name: 'AUD/USD', category: 'forex', ...randomOdds(), isLive: true, volume: 134000 },
    { id: 'gbpusd', symbol: 'GBPUSD', name: 'GBP/USD', category: 'forex', ...randomOdds(), isLive: true, volume: 198000 },
];

const CATEGORIES = [
    { id: 'all' as MarketCategory, label: 'All', icon: BarChart2, count: MARKETS.length },
    { id: 'crypto' as MarketCategory, label: 'Crypto', icon: Bitcoin, count: MARKETS.filter(m => m.category === 'crypto').length },
    { id: 'us_stocks' as MarketCategory, label: 'US Stocks', icon: DollarSign, count: MARKETS.filter(m => m.category === 'us_stocks').length },
    { id: 'indices' as MarketCategory, label: 'Indices', icon: TrendingUp, count: MARKETS.filter(m => m.category === 'indices').length },
    { id: 'hk_stocks' as MarketCategory, label: 'HK Stocks', icon: Building2, count: MARKETS.filter(m => m.category === 'hk_stocks').length },
    { id: 'commodities' as MarketCategory, label: 'Commodities', icon: Gem, count: MARKETS.filter(m => m.category === 'commodities').length },
    { id: 'forex' as MarketCategory, label: 'Forex', icon: Globe, count: MARKETS.filter(m => m.category === 'forex').length },
];

const getCategoryIcon = (category: MarketCategory) => {
    switch (category) {
        case 'crypto': return <Bitcoin size={18} />;
        case 'us_stocks': return <DollarSign size={18} />;
        case 'indices': return <TrendingUp size={18} />;
        case 'hk_stocks': return <Building2 size={18} />;
        case 'commodities': return <Gem size={18} />;
        case 'forex': return <Globe size={18} />;
        default: return <BarChart2 size={18} />;
    }
};

const getCategoryClass = (category: MarketCategory) => {
    switch (category) {
        case 'crypto': return 'crypto';
        case 'us_stocks': return 'us-stocks';
        case 'indices': return 'indices';
        case 'hk_stocks': return 'hk-stocks';
        case 'commodities': return 'commodities';
        case 'forex': return 'forex';
        default: return '';
    }
};

export const Markets = () => {
    const [selectedCategory, setSelectedCategory] = useState<MarketCategory>('all');
    const [selectedMarket, setSelectedMarket] = useState<string | null>(null);

    // If a market is selected, show the trading page
    if (selectedMarket) {
        return (
            <div className="markets-page">
                <button className="back-btn" onClick={() => setSelectedMarket(null)}>
                    ← Back to Markets
                </button>
                <CryptoBetting />
            </div>
        );
    }

    // Filter markets by category
    const filteredMarkets = selectedCategory === 'all'
        ? MARKETS
        : MARKETS.filter(m => m.category === selectedCategory);

    return (
        <div className="markets-page">
            <div className="markets-header">
                <h1>Markets</h1>
                <span className="timeframe-badge">15 Min</span>
            </div>

            {/* Category Filters */}
            <div className="markets-filters">
                <div className="category-list">
                    {CATEGORIES.map(cat => {
                        const Icon = cat.icon;
                        return (
                            <button
                                key={cat.id}
                                className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat.id)}
                            >
                                <Icon size={16} />
                                <span className="cat-label">{cat.label}</span>
                                <span className="cat-count">{cat.count}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Market Cards Grid */}
            <div className="markets-grid">
                {filteredMarkets.map(market => (
                    <div
                        key={market.id}
                        className={`market-card ${getCategoryClass(market.category)}`}
                        onClick={() => setSelectedMarket(market.id)}
                    >
                        <div className="card-header">
                            <div className={`market-icon ${getCategoryClass(market.category)}`}>
                                {getCategoryIcon(market.category)}
                            </div>
                            <div className="card-title">
                                <h3>{market.symbol}</h3>
                                <span className="subtitle">{market.name}</span>
                            </div>
                            <div className="card-odds">
                                <span className="odds-value">{Math.round(market.up * 100)}%</span>
                                <span className="odds-label">Up</span>
                            </div>
                        </div>

                        <div className="card-actions">
                            <button className="action-up" onClick={(e) => { e.stopPropagation(); }}>
                                Up ${market.up.toFixed(2)}
                            </button>
                            <button className="action-down" onClick={(e) => { e.stopPropagation(); }}>
                                Down ${market.down.toFixed(2)}
                            </button>
                        </div>

                        <div className="card-footer">
                            <span className="live-badge">● Live</span>
                            <span className="volume">${(market.volume / 1000).toFixed(1)}k Vol</span>
                            <button className="bookmark-btn" onClick={(e) => { e.stopPropagation(); }}>
                                <Bookmark size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
