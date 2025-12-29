import React, { useState } from 'react';
import { useI18n } from '../../i18n';
import { Search, ArrowUpRight, Info, ChevronDown, Banknote } from 'lucide-react';
import './Portfolio.css';

type TabType = 'positions' | 'openOrders' | 'history';
type TimeFilter = '1D' | '1W' | '1M' | 'ALL';

interface Position {
    id: string;
    market: string;
    avgPrice: number;
    currentPrice: number;
    bet: number;
    toWin: number;
    value: number;
    direction: 'UP' | 'DOWN';
}

// Mock data - empty for now
const MOCK_POSITIONS: Position[] = [];

export const Portfolio: React.FC = () => {
    const { t } = useI18n();
    const [activeTab, setActiveTab] = useState<TabType>('positions');
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('1D');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock portfolio data
    const portfolioValue = 0.00;
    const cashBalance = 0.00;
    const profitLoss = 0.00;
    const profitPercent = 0;

    const filteredPositions = MOCK_POSITIONS.filter(p =>
        p.market.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="portfolio-page animate-fade-in">
            {/* Top Stats Section */}
            <div className="portfolio-stats-row">
                {/* Portfolio Value Card */}
                <div className="portfolio-card portfolio-value-card">
                    <div className="card-header">
                        <span className="card-title">
                            {t.portfolio.title}
                            <span className="edit-icon">✎</span>
                        </span>
                        <div className="cash-badge">
                            <Banknote size={14} />
                            <span>${cashBalance.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="card-value">
                        ${portfolioValue.toFixed(2)}
                    </div>
                    <div className="card-period">{t.portfolio.today}</div>
                    <button className="withdraw-btn">
                        <ArrowUpRight size={16} />
                        {t.portfolio.withdraw}
                    </button>
                </div>

                {/* Profit/Loss Card */}
                <div className="portfolio-card profit-loss-card">
                    <div className="card-header">
                        <span className="card-title">
                            <span className={`pnl-indicator ${profitLoss >= 0 ? 'positive' : 'negative'}`}>▲</span>
                            {t.portfolio.profitLoss}
                        </span>
                        <div className="time-filters">
                            {(['1D', '1W', '1M', 'ALL'] as TimeFilter[]).map(filter => (
                                <button
                                    key={filter}
                                    className={`time-filter-btn ${timeFilter === filter ? 'active' : ''}`}
                                    onClick={() => setTimeFilter(filter)}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="card-value">
                        ${profitLoss.toFixed(2)}
                        <Info size={14} className="info-icon" />
                    </div>
                    <div className="card-period">{t.portfolio.pastDay}</div>
                    <div className="pnl-chart">
                        <div className="pnl-bar" style={{ width: `${Math.max(5, profitPercent)}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Positions Section */}
            <div className="positions-section">
                {/* Tabs */}
                <div className="positions-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'positions' ? 'active' : ''}`}
                        onClick={() => setActiveTab('positions')}
                    >
                        {t.portfolio.positions}
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'openOrders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('openOrders')}
                    >
                        {t.portfolio.openOrders}
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        {t.portfolio.history}
                    </button>
                </div>

                {/* Search and Filter Bar */}
                <div className="positions-toolbar">
                    <div className="search-box">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder={t.portfolio.search}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="sort-btn">
                        {t.portfolio.currentValue}
                        <ChevronDown size={14} />
                    </button>
                </div>

                {/* Table Header */}
                <div className="positions-table">
                    <div className="table-header">
                        <div className="col-market">{t.portfolio.market}</div>
                        <div className="col-avg">{t.portfolio.avgToNow} <Info size={12} /></div>
                        <div className="col-bet">{t.portfolio.bet}</div>
                        <div className="col-towin">{t.portfolio.toWin}</div>
                        <div className="col-value">
                            {t.portfolio.value}
                            <ChevronDown size={12} />
                        </div>
                    </div>

                    {/* Table Body */}
                    <div className="table-body">
                        {filteredPositions.length === 0 ? (
                            <div className="empty-state">
                                {t.portfolio.noPositions}
                            </div>
                        ) : (
                            filteredPositions.map(position => (
                                <div key={position.id} className="position-row">
                                    <div className="col-market">{position.market}</div>
                                    <div className="col-avg">
                                        ${position.avgPrice.toFixed(2)} → ${position.currentPrice.toFixed(2)}
                                    </div>
                                    <div className="col-bet">${position.bet.toFixed(2)}</div>
                                    <div className="col-towin">${position.toWin.toFixed(2)}</div>
                                    <div className="col-value">${position.value.toFixed(2)}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
