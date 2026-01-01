import { useState } from 'react';
import { Bitcoin, TrendingUp, Bookmark } from 'lucide-react';
import { CryptoBetting } from '../CryptoBetting/CryptoBetting';
import './Markets.css';

// Market category types
type MarketCategory = 'all' | '15min' | 'hourly' | 'daily' | 'weekly';

interface MarketItem {
    id: string;
    name: string;
    subtitle: string;
    icon: 'btc' | 'eth' | 'sol' | 'xrp';
    upOdds: number;
    downOdds: number;
    isLive: boolean;
    timeframe: string;
    volume: number;
}

// Mock market data
const MARKETS: MarketItem[] = [
    {
        id: 'btc-15min',
        name: 'Bitcoin Up or Down',
        subtitle: '15 minute',
        icon: 'btc',
        upOdds: 0.74,
        downOdds: 0.27,
        isLive: true,
        timeframe: '15 Min',
        volume: 84500
    },
    {
        id: 'eth-15min',
        name: 'Ethereum Up or Down',
        subtitle: '15 minute',
        icon: 'eth',
        upOdds: 0.49,
        downOdds: 0.52,
        isLive: true,
        timeframe: '15 Min',
        volume: 62300
    },
    {
        id: 'sol-15min',
        name: 'Solana Up or Down',
        subtitle: '15 minute',
        icon: 'sol',
        upOdds: 0.55,
        downOdds: 0.46,
        isLive: true,
        timeframe: '15 Min',
        volume: 31200
    },
    {
        id: 'xrp-15min',
        name: 'XRP Up or Down',
        subtitle: '15 minute',
        icon: 'xrp',
        upOdds: 0.78,
        downOdds: 0.23,
        isLive: true,
        timeframe: '15 Min',
        volume: 18700
    }
];

const CATEGORIES = [
    { id: 'all' as MarketCategory, label: 'All', count: 244 },
    { id: '15min' as MarketCategory, label: '15 Min', count: 4 },
    { id: 'hourly' as MarketCategory, label: 'Hourly', count: 4 },
    { id: 'daily' as MarketCategory, label: 'Daily', count: 4 },
    { id: 'weekly' as MarketCategory, label: 'Weekly', count: 20 },
];

const getIconComponent = (icon: string) => {
    switch (icon) {
        case 'btc':
            return <div className="market-icon btc"><Bitcoin size={20} /></div>;
        case 'eth':
            return <div className="market-icon eth">Ξ</div>;
        case 'sol':
            return <div className="market-icon sol">◎</div>;
        case 'xrp':
            return <div className="market-icon xrp">✕</div>;
        default:
            return <div className="market-icon"><TrendingUp size={20} /></div>;
    }
};

export const Markets = () => {
    const [selectedCategory, setSelectedCategory] = useState<MarketCategory>('all');
    const [selectedMarket, setSelectedMarket] = useState<string | null>(null);

    // If a market is selected, show the trading page
    if (selectedMarket === 'btc-15min') {
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
        : MARKETS.filter(m => m.timeframe.toLowerCase().includes(selectedCategory.replace('min', ' min')));

    return (
        <div className="markets-page">
            <div className="markets-header">
                <h1>Markets</h1>
            </div>

            {/* Category Filters */}
            <div className="markets-filters">
                <div className="category-list">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat.id)}
                        >
                            <span className="cat-label">{cat.label}</span>
                            <span className="cat-count">{cat.count}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Market Cards Grid */}
            <div className="markets-grid">
                {filteredMarkets.map(market => (
                    <div
                        key={market.id}
                        className="market-card"
                        onClick={() => setSelectedMarket(market.id)}
                    >
                        <div className="card-header">
                            {getIconComponent(market.icon)}
                            <div className="card-title">
                                <h3>{market.name}</h3>
                                <span className="subtitle">{market.subtitle}</span>
                            </div>
                            <div className="card-odds">
                                <span className="odds-value">{Math.round(market.upOdds * 100)}%</span>
                                <span className="odds-label">Up</span>
                            </div>
                        </div>

                        <div className="card-actions">
                            <button className="action-up">Up</button>
                            <button className="action-down">Down</button>
                        </div>

                        <div className="card-footer">
                            {market.isLive && <span className="live-badge">● Live</span>}
                            <button className="bookmark-btn"><Bookmark size={14} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
