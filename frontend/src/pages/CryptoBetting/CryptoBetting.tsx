import { useState, useEffect } from 'react';
import { Bitcoin, Clock, RefreshCw, BookOpen, TrendingUp, TrendingDown } from 'lucide-react';
import { MarketBetModal } from '../../components/MarketBetModal';
import './CryptoBetting.css';

// Types
interface OrderBookEntry {
    price: number;
    shares: number;
    total: number;
}

interface PeriodInfo {
    start: Date;
    end: Date;
    priceTobeat: number;
}

// Mock data generator
const generateMockChartData = () => {
    const data = [];
    const basePrice = 87840;
    let currentPrice = basePrice;
    const now = new Date();

    for (let i = 0; i < 100; i++) {
        currentPrice += (Math.random() - 0.52) * 50;
        data.push({
            time: new Date(now.getTime() - (100 - i) * 1000),
            price: currentPrice
        });
    }
    return data;
};

const generateMockOrderBook = (side: 'up' | 'down'): OrderBookEntry[] => {
    const entries: OrderBookEntry[] = [];
    const basePrice = side === 'up' ? 0.74 : 0.27;

    for (let i = 0; i < 8; i++) {
        const price = basePrice - i * 0.01;
        const shares = Math.floor(Math.random() * 500) + 100;
        entries.push({
            price,
            shares,
            total: price * shares
        });
    }
    return entries;
};

// Get current 15-minute period
const getCurrentPeriod = (): PeriodInfo => {
    const now = new Date();
    const minutes = now.getMinutes();
    const periodStart = Math.floor(minutes / 15) * 15;

    const start = new Date(now);
    start.setMinutes(periodStart, 0, 0);

    const end = new Date(start);
    end.setMinutes(periodStart + 15);

    return {
        start,
        end,
        priceTobeat: 87840.20
    };
};

const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

const formatPeriodRange = (period: PeriodInfo): string => {
    const startStr = formatTime(period.start);
    const endStr = formatTime(period.end);
    const dateStr = period.start.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    return `${dateStr}, ${startStr}-${endStr} ET`;
};

export const CryptoBetting = () => {
    const [selectedSide, setSelectedSide] = useState<'up' | 'down'>('up');
    const [orderBookTab, setOrderBookTab] = useState<'up' | 'down'>('up');
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [chartData] = useState(generateMockChartData());
    const [currentPrice, setCurrentPrice] = useState(87840.20);
    const [period] = useState(getCurrentPeriod());

    // Modal state
    const [showBetModal, setShowBetModal] = useState(false);
    const [betDirection, setBetDirection] = useState<'up' | 'down'>('up');

    // Odds (in dollars)
    const upOdds = 0.74;
    const downOdds = 0.27;

    // Volume
    const volume = 84500;

    // Countdown timer
    useEffect(() => {
        const updateTimer = () => {
            const now = new Date();
            const diff = period.end.getTime() - now.getTime();
            setTimeLeft(Math.max(0, Math.floor(diff / 1000)));
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [period]);

    // Simulate price updates
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPrice(prev => prev + (Math.random() - 0.52) * 20);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const formatCountdown = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Open bet modal
    const handleOpenBetModal = (direction: 'up' | 'down') => {
        setBetDirection(direction);
        setShowBetModal(true);
    };

    const orderBookData = generateMockOrderBook(orderBookTab);

    return (
        <div className="crypto-betting-page">
            {/* Header */}
            <div className="crypto-header">
                <div className="crypto-title">
                    <div className="btc-icon">
                        <Bitcoin size={24} />
                    </div>
                    <div className="title-text">
                        <h1>Bitcoin Up or Down</h1>
                        <span className="period-range">{formatPeriodRange(period)}</span>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="icon-btn"><RefreshCw size={18} /></button>
                    <button className="icon-btn"><BookOpen size={18} /></button>
                </div>
            </div>

            <div className="crypto-content">
                {/* Left: Chart Area */}
                <div className="chart-section">
                    <div className="price-to-beat">
                        <span className="label">PRICE TO BEAT</span>
                        <span className="price">${period.priceTobeat.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>

                    {/* Simple Chart Visualization */}
                    <div className="chart-container">
                        <svg viewBox="0 0 800 300" className="price-chart">
                            {/* Price line */}
                            <polyline
                                fill="none"
                                stroke="#f97316"
                                strokeWidth="2"
                                points={chartData.map((d, i) => `${i * 8},${150 - (d.price - 87800) * 2}`).join(' ')}
                            />
                            {/* Target line */}
                            <line
                                x1="0"
                                y1={150 - (period.priceTobeat - 87800) * 2}
                                x2="800"
                                y2={150 - (period.priceTobeat - 87800) * 2}
                                stroke="#ef4444"
                                strokeDasharray="5,5"
                                strokeWidth="1"
                            />
                            {/* Current price marker */}
                            <circle
                                cx={chartData.length * 8 - 8}
                                cy={150 - (currentPrice - 87800) * 2}
                                r="4"
                                fill="#f97316"
                            />
                        </svg>

                        {/* Y-axis labels */}
                        <div className="y-axis">
                            <span>$88,040</span>
                            <span>$88,020</span>
                            <span>$88,000</span>
                            <span>$87,980</span>
                        </div>

                        {/* Target badge */}
                        <div className="target-badge">
                            Target ▼
                        </div>
                    </div>

                    {/* Countdown */}
                    <div className="countdown-section">
                        <Clock size={16} />
                        <span>Ends in {formatCountdown(timeLeft)}</span>
                    </div>
                </div>

                {/* Right: Betting Panel */}
                <div className="betting-section">
                    <h3 className="section-title">Predict Direction</h3>

                    {/* Up/Down Selection */}
                    <div className="side-selection">
                        <button
                            className={`side-btn up ${selectedSide === 'up' ? 'selected' : ''}`}
                            onClick={() => setSelectedSide('up')}
                        >
                            <TrendingUp size={18} />
                            Up ${upOdds}
                        </button>
                        <button
                            className={`side-btn down ${selectedSide === 'down' ? 'selected' : ''}`}
                            onClick={() => setSelectedSide('down')}
                        >
                            <TrendingDown size={18} />
                            Down ${downOdds}
                        </button>
                    </div>

                    {/* Place Bet Button */}
                    <button
                        className={`action-btn ${selectedSide}`}
                        onClick={() => handleOpenBetModal(selectedSide)}
                    >
                        Place {selectedSide === 'up' ? 'Up' : 'Down'} Prediction
                    </button>

                    <p className="terms">By trading, you agree to the <a href="#">Terms of Use</a>.</p>
                </div>
            </div>

            {/* Order Book */}
            <div className="order-book-section">
                <div className="order-book-header">
                    <div className="ob-title">
                        <span>Order Book</span>
                        <span className="help-icon">?</span>
                    </div>
                    <div className="ob-volume">
                        ${(volume / 1000).toFixed(1)}k Vol. ▲
                    </div>
                </div>

                <div className="order-book-tabs">
                    <button
                        className={`ob-tab ${orderBookTab === 'up' ? 'active' : ''}`}
                        onClick={() => setOrderBookTab('up')}
                    >
                        Trade Up
                    </button>
                    <button
                        className={`ob-tab ${orderBookTab === 'down' ? 'active' : ''}`}
                        onClick={() => setOrderBookTab('down')}
                    >
                        Trade Down
                    </button>
                    <button className="refresh-btn"><RefreshCw size={14} /></button>
                </div>

                <table className="order-book-table">
                    <thead>
                        <tr>
                            <th>TRADE {orderBookTab.toUpperCase()} ≡</th>
                            <th>PRICE</th>
                            <th>SHARES</th>
                            <th>TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderBookData.map((entry, i) => (
                            <tr key={i}>
                                <td>
                                    <div
                                        className={`depth-bar ${orderBookTab}`}
                                        style={{ width: `${(entry.shares / 600) * 100}%` }}
                                    />
                                </td>
                                <td>${entry.price.toFixed(2)}</td>
                                <td>{entry.shares}</td>
                                <td>${entry.total.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="order-book-footer">
                    <span>Last: $0.70</span>
                    <span>Spread: $0.00</span>
                </div>
            </div>

            {/* Bet Modal */}
            {showBetModal && (
                <MarketBetModal
                    market={{
                        id: 'btc',
                        symbol: 'BTC',
                        name: 'Bitcoin',
                        upOdds: upOdds,
                        downOdds: downOdds,
                    }}
                    direction={betDirection}
                    onClose={() => setShowBetModal(false)}
                />
            )}
        </div>
    );
};
