import React from 'react';
import type { Asset } from '../../types';
import { useI18n } from '../../i18n';
import './AssetHero.css';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

interface AssetHeroProps {
    asset: Asset;
}

// Mock data for sparkline trend
const MOCK_TREND = [
    { value: 40 }, { value: 35 }, { value: 50 }, { value: 45 },
    { value: 60 }, { value: 55 }, { value: 70 }, { value: 65 },
    { value: 80 }, { value: 75 }, { value: 90 }
];

export const AssetHero: React.FC<AssetHeroProps> = ({ asset }) => {
    const { t } = useI18n();
    const isPositive = asset.change24h >= 0;

    return (
        <div className="asset-hero glass-panel animate-fade-in">
            <div className="hero-top">
                <div className="asset-identity">
                    <div className="asset-avatar">
                        {asset.symbol.charAt(0)}
                    </div>
                    <div className="asset-names">
                        <h1>{asset.name} <span className="symbol">{asset.symbol}</span></h1>
                        <div className="live-status">
                            <span className="pulse-dot"></span>
                            <Activity size={12} />
                            <span>{t.assetHero.liveMarketData}</span>
                        </div>
                    </div>
                </div>

                <div className="mini-chart">
                    <ResponsiveContainer width="100%" height={60}>
                        <AreaChart data={MOCK_TREND}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={isPositive ? 'var(--status-up)' : 'var(--status-down)'} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={isPositive ? 'var(--status-up)' : 'var(--status-down)'} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke={isPositive ? 'var(--status-up)' : 'var(--status-down)'}
                                fillOpacity={1}
                                strokeWidth={2}
                                fill="url(#colorValue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="hero-bottom">
                <div className="price-display">
                    <div className="current-price">
                        <span className="currency">$</span>
                        {asset.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div className={`price-change ${isPositive ? 'positive' : 'negative'}`}>
                        {isPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                        <span>{isPositive ? '+' : ''}{asset.change24h.toFixed(2)}%</span>
                        <span className="period">24h</span>
                    </div>
                </div>

                <div className="asset-stats">
                    <div className="stat-item">
                        <span className="stat-label">{t.assetHero.marketCap}</span>
                        <span className="stat-value">$1.2T</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">{t.assetHero.volume24h}</span>
                        <span className="stat-value">$45.8B</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">{t.assetHero.volatility}</span>
                        <span className="stat-value high">{t.assetHero.high}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
