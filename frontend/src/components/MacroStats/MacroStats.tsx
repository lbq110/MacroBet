import { useState } from 'react';
import { TrendingUp, TrendingDown, BarChart2, Calendar, DollarSign, Briefcase, Activity } from 'lucide-react';
import './MacroStats.css';

// Types
type MacroIndicator = 'cpi' | 'nfp' | 'gdp' | 'fed_rate';
type AssetCategory = 'crypto' | 'stocks' | 'commodities' | 'forex';
type ResultType = 'above' | 'inline' | 'below';

interface StatData {
    category: AssetCategory;
    categoryName: string;
    avgChange: number;
    upCount: number;
    downCount: number;
    sampleSize: number;
}

interface IndicatorStats {
    id: MacroIndicator;
    name: string;
    nameCn: string;
    icon: typeof TrendingUp;
    description: string;
    frequency: string;
    results: {
        above: StatData[];
        inline: StatData[];
        below: StatData[];
    };
}

// Mock 30-year historical statistics data
const MACRO_STATS: IndicatorStats[] = [
    {
        id: 'cpi',
        name: 'US CPI',
        nameCn: '美国CPI',
        icon: DollarSign,
        description: 'Consumer Price Index - Key inflation measure',
        frequency: 'Monthly',
        results: {
            above: [
                { category: 'crypto', categoryName: 'Crypto', avgChange: -3.2, upCount: 45, downCount: 135, sampleSize: 180 },
                { category: 'stocks', categoryName: 'US Stocks', avgChange: -1.8, upCount: 68, downCount: 112, sampleSize: 180 },
                { category: 'commodities', categoryName: 'Commodities', avgChange: 1.2, upCount: 98, downCount: 82, sampleSize: 180 },
                { category: 'forex', categoryName: 'Forex (DXY)', avgChange: 0.8, upCount: 105, downCount: 75, sampleSize: 180 },
            ],
            inline: [
                { category: 'crypto', categoryName: 'Crypto', avgChange: 0.5, upCount: 55, downCount: 45, sampleSize: 100 },
                { category: 'stocks', categoryName: 'US Stocks', avgChange: 0.2, upCount: 52, downCount: 48, sampleSize: 100 },
                { category: 'commodities', categoryName: 'Commodities', avgChange: 0.1, upCount: 51, downCount: 49, sampleSize: 100 },
                { category: 'forex', categoryName: 'Forex (DXY)', avgChange: 0.0, upCount: 50, downCount: 50, sampleSize: 100 },
            ],
            below: [
                { category: 'crypto', categoryName: 'Crypto', avgChange: 4.5, upCount: 142, downCount: 38, sampleSize: 180 },
                { category: 'stocks', categoryName: 'US Stocks', avgChange: 2.1, upCount: 125, downCount: 55, sampleSize: 180 },
                { category: 'commodities', categoryName: 'Commodities', avgChange: -0.8, upCount: 72, downCount: 108, sampleSize: 180 },
                { category: 'forex', categoryName: 'Forex (DXY)', avgChange: -0.6, upCount: 68, downCount: 112, sampleSize: 180 },
            ],
        },
    },
    {
        id: 'nfp',
        name: 'Non-Farm Payrolls',
        nameCn: '非农就业',
        icon: Briefcase,
        description: 'Employment data excluding farm workers',
        frequency: 'Monthly',
        results: {
            above: [
                { category: 'crypto', categoryName: 'Crypto', avgChange: -2.1, upCount: 62, downCount: 118, sampleSize: 180 },
                { category: 'stocks', categoryName: 'US Stocks', avgChange: 1.5, upCount: 112, downCount: 68, sampleSize: 180 },
                { category: 'commodities', categoryName: 'Commodities', avgChange: -0.5, upCount: 78, downCount: 102, sampleSize: 180 },
                { category: 'forex', categoryName: 'Forex (DXY)', avgChange: 0.9, upCount: 108, downCount: 72, sampleSize: 180 },
            ],
            inline: [
                { category: 'crypto', categoryName: 'Crypto', avgChange: 0.3, upCount: 53, downCount: 47, sampleSize: 100 },
                { category: 'stocks', categoryName: 'US Stocks', avgChange: 0.1, upCount: 51, downCount: 49, sampleSize: 100 },
                { category: 'commodities', categoryName: 'Commodities', avgChange: 0.0, upCount: 50, downCount: 50, sampleSize: 100 },
                { category: 'forex', categoryName: 'Forex (DXY)', avgChange: 0.1, upCount: 52, downCount: 48, sampleSize: 100 },
            ],
            below: [
                { category: 'crypto', categoryName: 'Crypto', avgChange: 2.8, upCount: 125, downCount: 55, sampleSize: 180 },
                { category: 'stocks', categoryName: 'US Stocks', avgChange: -1.2, upCount: 65, downCount: 115, sampleSize: 180 },
                { category: 'commodities', categoryName: 'Commodities', avgChange: 0.8, upCount: 95, downCount: 85, sampleSize: 180 },
                { category: 'forex', categoryName: 'Forex (DXY)', avgChange: -0.7, upCount: 72, downCount: 108, sampleSize: 180 },
            ],
        },
    },
    {
        id: 'gdp',
        name: 'US GDP',
        nameCn: 'GDP',
        icon: BarChart2,
        description: 'Gross Domestic Product growth rate',
        frequency: 'Quarterly',
        results: {
            above: [
                { category: 'crypto', categoryName: 'Crypto', avgChange: 2.5, upCount: 82, downCount: 38, sampleSize: 120 },
                { category: 'stocks', categoryName: 'US Stocks', avgChange: 1.8, upCount: 88, downCount: 32, sampleSize: 120 },
                { category: 'commodities', categoryName: 'Commodities', avgChange: 0.6, upCount: 68, downCount: 52, sampleSize: 120 },
                { category: 'forex', categoryName: 'Forex (DXY)', avgChange: 0.4, upCount: 65, downCount: 55, sampleSize: 120 },
            ],
            inline: [
                { category: 'crypto', categoryName: 'Crypto', avgChange: 0.2, upCount: 32, downCount: 28, sampleSize: 60 },
                { category: 'stocks', categoryName: 'US Stocks', avgChange: 0.1, upCount: 31, downCount: 29, sampleSize: 60 },
                { category: 'commodities', categoryName: 'Commodities', avgChange: 0.0, upCount: 30, downCount: 30, sampleSize: 60 },
                { category: 'forex', categoryName: 'Forex (DXY)', avgChange: 0.0, upCount: 30, downCount: 30, sampleSize: 60 },
            ],
            below: [
                { category: 'crypto', categoryName: 'Crypto', avgChange: -3.8, upCount: 35, downCount: 85, sampleSize: 120 },
                { category: 'stocks', categoryName: 'US Stocks', avgChange: -2.2, upCount: 42, downCount: 78, sampleSize: 120 },
                { category: 'commodities', categoryName: 'Commodities', avgChange: 1.2, upCount: 75, downCount: 45, sampleSize: 120 },
                { category: 'forex', categoryName: 'Forex (DXY)', avgChange: -0.5, upCount: 52, downCount: 68, sampleSize: 120 },
            ],
        },
    },
    {
        id: 'fed_rate',
        name: 'Fed Rate Decision',
        nameCn: '美联储利率决议',
        icon: Activity,
        description: 'Federal Reserve interest rate decisions',
        frequency: '8x per year',
        results: {
            above: [ // Rate Hike
                { category: 'crypto', categoryName: 'Crypto', avgChange: -5.2, upCount: 28, downCount: 92, sampleSize: 120 },
                { category: 'stocks', categoryName: 'US Stocks', avgChange: -2.5, upCount: 38, downCount: 82, sampleSize: 120 },
                { category: 'commodities', categoryName: 'Commodities', avgChange: -1.8, upCount: 42, downCount: 78, sampleSize: 120 },
                { category: 'forex', categoryName: 'Forex (DXY)', avgChange: 1.5, upCount: 88, downCount: 32, sampleSize: 120 },
            ],
            inline: [ // No Change
                { category: 'crypto', categoryName: 'Crypto', avgChange: 0.8, upCount: 55, downCount: 45, sampleSize: 100 },
                { category: 'stocks', categoryName: 'US Stocks', avgChange: 0.3, upCount: 52, downCount: 48, sampleSize: 100 },
                { category: 'commodities', categoryName: 'Commodities', avgChange: 0.1, upCount: 51, downCount: 49, sampleSize: 100 },
                { category: 'forex', categoryName: 'Forex (DXY)', avgChange: 0.0, upCount: 50, downCount: 50, sampleSize: 100 },
            ],
            below: [ // Rate Cut
                { category: 'crypto', categoryName: 'Crypto', avgChange: 6.8, upCount: 95, downCount: 25, sampleSize: 120 },
                { category: 'stocks', categoryName: 'US Stocks', avgChange: 3.2, upCount: 88, downCount: 32, sampleSize: 120 },
                { category: 'commodities', categoryName: 'Commodities', avgChange: 2.1, upCount: 78, downCount: 42, sampleSize: 120 },
                { category: 'forex', categoryName: 'Forex (DXY)', avgChange: -1.2, upCount: 35, downCount: 85, sampleSize: 120 },
            ],
        },
    },
];

const getResultLabel = (indicator: MacroIndicator, result: ResultType): string => {
    if (indicator === 'fed_rate') {
        return result === 'above' ? 'Rate Hike' : result === 'inline' ? 'No Change' : 'Rate Cut';
    }
    return result === 'above' ? 'Above Expectation' : result === 'inline' ? 'In Line' : 'Below Expectation';
};

const getResultLabelCn = (indicator: MacroIndicator, result: ResultType): string => {
    if (indicator === 'fed_rate') {
        return result === 'above' ? '加息' : result === 'inline' ? '维持不变' : '降息';
    }
    return result === 'above' ? '高于预期' : result === 'inline' ? '符合预期' : '低于预期';
};

export const MacroStats = () => {
    const [selectedIndicator, setSelectedIndicator] = useState<MacroIndicator>('cpi');
    const [selectedResult, setSelectedResult] = useState<ResultType>('above');

    const indicator = MACRO_STATS.find(i => i.id === selectedIndicator)!;
    const stats = indicator.results[selectedResult];

    return (
        <div className="macro-stats">
            <div className="stats-header">
                <div className="header-title">
                    <BarChart2 size={24} />
                    <div>
                        <h2>Macro Data Impact</h2>
                        <span className="subtitle">30-Year Historical Statistics</span>
                    </div>
                </div>
            </div>

            {/* Indicator Selector */}
            <div className="indicator-selector">
                {MACRO_STATS.map(ind => {
                    const Icon = ind.icon;
                    return (
                        <button
                            key={ind.id}
                            className={`indicator-btn ${selectedIndicator === ind.id ? 'active' : ''}`}
                            onClick={() => setSelectedIndicator(ind.id)}
                        >
                            <Icon size={18} />
                            <span>{ind.nameCn}</span>
                        </button>
                    );
                })}
            </div>

            {/* Result Type Selector */}
            <div className="result-selector">
                <button
                    className={`result-btn above ${selectedResult === 'above' ? 'active' : ''}`}
                    onClick={() => setSelectedResult('above')}
                >
                    {getResultLabelCn(selectedIndicator, 'above')}
                </button>
                <button
                    className={`result-btn inline ${selectedResult === 'inline' ? 'active' : ''}`}
                    onClick={() => setSelectedResult('inline')}
                >
                    {getResultLabelCn(selectedIndicator, 'inline')}
                </button>
                <button
                    className={`result-btn below ${selectedResult === 'below' ? 'active' : ''}`}
                    onClick={() => setSelectedResult('below')}
                >
                    {getResultLabelCn(selectedIndicator, 'below')}
                </button>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                {stats.map(stat => (
                    <div key={stat.category} className="stat-card">
                        <div className="stat-header">
                            <span className="category-name">{stat.categoryName}</span>
                            <span className="sample-size">n={stat.sampleSize}</span>
                        </div>

                        <div className={`avg-change ${stat.avgChange >= 0 ? 'positive' : 'negative'}`}>
                            {stat.avgChange >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                            <span>{stat.avgChange >= 0 ? '+' : ''}{stat.avgChange.toFixed(1)}%</span>
                        </div>

                        {/* Bar Chart */}
                        <div className="probability-bar">
                            <div
                                className="up-bar"
                                style={{ width: `${(stat.upCount / stat.sampleSize) * 100}%` }}
                            />
                            <div
                                className="down-bar"
                                style={{ width: `${(stat.downCount / stat.sampleSize) * 100}%` }}
                            />
                        </div>

                        <div className="probability-labels">
                            <span className="up-label">
                                ↑ {Math.round((stat.upCount / stat.sampleSize) * 100)}%
                            </span>
                            <span className="down-label">
                                ↓ {Math.round((stat.downCount / stat.sampleSize) * 100)}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="stats-footer">
                <Calendar size={14} />
                <span>Based on {indicator.frequency.toLowerCase()} data releases from 1994-2024</span>
            </div>
        </div>
    );
};
