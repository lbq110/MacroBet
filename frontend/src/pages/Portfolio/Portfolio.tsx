import React, { useState } from 'react';
import { useI18n } from '../../i18n';
import { useBets } from '../../context/BetsContext';
import type { BetOrder } from '../../context/BetsContext';
import { Search, ArrowUpRight, Info, ChevronDown, Banknote, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import './Portfolio.css';

type TabType = 'positions' | 'openOrders' | 'history';
type TimeFilter = '1D' | '1W' | '1M' | 'ALL';

export const Portfolio: React.FC = () => {
    const { t } = useI18n();
    const { getOpenOrders, getHistory, getTotalPending } = useBets();

    const [activeTab, setActiveTab] = useState<TabType>('openOrders');
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('1D');
    const [searchQuery, setSearchQuery] = useState('');

    // Calculate portfolio stats from orders
    const openOrders = getOpenOrders();
    const historyOrders = getHistory();
    const totalPending = getTotalPending();

    const portfolioValue = totalPending;
    const cashBalance = 0.00; // Would come from user account
    const profitLoss = historyOrders.reduce((sum, o) => {
        if (o.status === 'won') return sum + (o.payout || 0) - o.amount;
        if (o.status === 'lost') return sum - o.amount;
        return sum;
    }, 0);
    const profitPercent = portfolioValue > 0 ? (profitLoss / portfolioValue) * 100 : 0;

    // Filter based on search
    const filterOrders = (orderList: BetOrder[]) => {
        if (!searchQuery) return orderList;
        return orderList.filter(o =>
            o.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.optionLabel.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const getStatusIcon = (status: BetOrder['status']) => {
        switch (status) {
            case 'pending': return <Clock size={14} className="status-icon pending" />;
            case 'won': return <CheckCircle size={14} className="status-icon won" />;
            case 'lost': return <XCircle size={14} className="status-icon lost" />;
            case 'refunded': return <RefreshCw size={14} className="status-icon refunded" />;
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

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
                            <span className={`pnl-indicator ${profitLoss >= 0 ? 'positive' : 'negative'}`}>
                                {profitLoss >= 0 ? '▲' : '▼'}
                            </span>
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
                    <div className={`card-value ${profitLoss >= 0 ? 'positive' : 'negative'}`}>
                        {profitLoss >= 0 ? '+' : ''}${profitLoss.toFixed(2)}
                        <Info size={14} className="info-icon" />
                    </div>
                    <div className="card-period">{t.portfolio.pastDay}</div>
                    <div className="pnl-chart">
                        <div className="pnl-bar" style={{ width: `${Math.max(5, Math.abs(profitPercent))}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Orders Section */}
            <div className="positions-section">
                {/* Tabs */}
                <div className="positions-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'openOrders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('openOrders')}
                    >
                        {t.portfolio.openOrders}
                        {openOrders.length > 0 && (
                            <span className="tab-count">{openOrders.length}</span>
                        )}
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        {t.portfolio.history}
                        {historyOrders.length > 0 && (
                            <span className="tab-count">{historyOrders.length}</span>
                        )}
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

                {/* Orders List */}
                <div className="orders-list">
                    {activeTab === 'openOrders' && (
                        filterOrders(openOrders).length === 0 ? (
                            <div className="empty-state">
                                <Clock size={48} />
                                <p>No open orders</p>
                                <span>Place a bet to see it here</span>
                            </div>
                        ) : (
                            filterOrders(openOrders).map(order => (
                                <div key={order.id} className="order-card pending">
                                    <div className="order-header">
                                        <div className="order-event">
                                            <span className="event-name">{order.eventName}</span>
                                            <span className="mode-badge">{order.modeLabel}</span>
                                        </div>
                                        <div className="order-status">
                                            {getStatusIcon(order.status)}
                                            <span>Pending</span>
                                        </div>
                                    </div>
                                    <div className="order-details">
                                        <div className="detail-row">
                                            <span className="label">Selection</span>
                                            <span className="value selection">{order.optionLabel}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Amount</span>
                                            <span className="value">${order.amount.toFixed(2)}</span>
                                        </div>
                                        {order.potentialWin && (
                                            <div className="detail-row">
                                                <span className="label">Potential Win</span>
                                                <span className="value potential">${order.potentialWin.toFixed(2)}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="order-footer">
                                        <span className="order-time">{formatDate(order.createdAt)}</span>
                                    </div>
                                </div>
                            ))
                        )
                    )}

                    {activeTab === 'history' && (
                        filterOrders(historyOrders).length === 0 ? (
                            <div className="empty-state">
                                <Clock size={48} />
                                <p>No trade history</p>
                                <span>Completed bets will appear here</span>
                            </div>
                        ) : (
                            filterOrders(historyOrders).map(order => (
                                <div key={order.id} className={`order-card ${order.status}`}>
                                    <div className="order-header">
                                        <div className="order-event">
                                            <span className="event-name">{order.eventName}</span>
                                            <span className="mode-badge">{order.modeLabel}</span>
                                        </div>
                                        <div className={`order-status ${order.status}`}>
                                            {getStatusIcon(order.status)}
                                            <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                                        </div>
                                    </div>
                                    <div className="order-details">
                                        <div className="detail-row">
                                            <span className="label">Selection</span>
                                            <span className="value selection">{order.optionLabel}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Bet</span>
                                            <span className="value">${order.amount.toFixed(2)}</span>
                                        </div>
                                        {order.payout !== undefined && (
                                            <div className="detail-row">
                                                <span className="label">Payout</span>
                                                <span className={`value ${order.status === 'won' ? 'won' : ''}`}>
                                                    ${order.payout.toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="order-footer">
                                        <span className="order-time">{formatDate(order.settledAt || order.createdAt)}</span>
                                    </div>
                                </div>
                            ))
                        )
                    )}
                </div>
            </div>
        </div>
    );
};
