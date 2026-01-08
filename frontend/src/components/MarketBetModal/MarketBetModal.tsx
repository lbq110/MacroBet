import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Clock, X } from 'lucide-react';
import { useBets } from '../../context/BetsContext';
import './MarketBetModal.css';

interface MarketInfo {
    id: string;
    symbol: string;
    name: string;
    upOdds: number;
    downOdds: number;
}

interface PeriodOption {
    label: string;
    start: Date;
    end: Date;
    priceTobeat: number;
}

interface MarketBetModalProps {
    market: MarketInfo;
    direction: 'up' | 'down';
    onClose: () => void;
}

// Get available 15-minute periods
const getAvailablePeriods = (): PeriodOption[] => {
    const now = new Date();
    const periods: PeriodOption[] = [];

    // Current period
    const currentMinutes = now.getMinutes();
    const currentPeriodStart = Math.floor(currentMinutes / 15) * 15;

    for (let i = 0; i < 4; i++) {
        const start = new Date(now);
        start.setMinutes(currentPeriodStart + i * 15, 0, 0);

        const end = new Date(start);
        end.setMinutes(start.getMinutes() + 15);

        // Skip if period has already ended
        if (end <= now) continue;

        const formatTime = (d: Date) => d.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });

        const label = i === 0
            ? `Current (${formatTime(start)} - ${formatTime(end)})`
            : `Next +${i * 15}min (${formatTime(start)} - ${formatTime(end)})`;

        periods.push({
            label,
            start,
            end,
            priceTobeat: 87840 + Math.random() * 200 - 100 // Mock base price
        });
    }

    return periods;
};

export const MarketBetModal: React.FC<MarketBetModalProps> = ({ market, direction, onClose }) => {
    const { addOrder } = useBets();
    const [betAmount, setBetAmount] = useState<string>('10');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(0);

    const periods = useMemo(() => getAvailablePeriods(), []);
    const selectedPeriod = periods[selectedPeriodIndex];

    const odds = direction === 'up' ? market.upOdds : market.downOdds;
    const potentialWin = useMemo(() => {
        const amount = parseFloat(betAmount) || 0;
        // Pari-mutuel: odds represent price, potential win = amount / odds
        return amount / odds;
    }, [betAmount, odds]);

    const handleSubmit = async () => {
        const amount = parseFloat(betAmount);
        if (isNaN(amount) || amount < 1) {
            alert('Please enter a valid amount (minimum $1)');
            return;
        }
        if (amount > 10000) {
            alert('Maximum bet amount is $10,000');
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        // Add to global state
        addOrder({
            eventId: `market_${market.id}_${selectedPeriod.start.getTime()}`,
            eventName: `${market.symbol} ${direction === 'up' ? '▲' : '▼'} Prediction`,
            mode: direction === 'up' ? 'sniper' : 'vol', // Reuse existing mode types
            modeLabel: `${market.name} · ${direction === 'up' ? 'Up' : 'Down'}`,
            optionId: `${market.id}_${direction}`,
            optionLabel: `${selectedPeriod.label}`,
            amount: amount,
            odds: odds,
            potentialWin: potentialWin,
        });

        setIsSubmitting(false);
        onClose();

        // Show toast notification
        const notification = document.createElement('div');
        notification.className = 'bet-success-toast';
        notification.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">✅</span>
                <div class="toast-text">
                    <strong>Prediction Placed!</strong>
                    <span>${market.symbol} ${direction === 'up' ? 'Up' : 'Down'} · $${amount}</span>
                </div>
            </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    };

    return (
        <div className="market-bet-overlay" onClick={onClose}>
            <div className="market-bet-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>
                        {direction === 'up' ? <TrendingUp size={22} /> : <TrendingDown size={22} />}
                        Predict {market.symbol}
                    </h3>
                    <button className="close-btn" onClick={onClose}><X size={18} /></button>
                </div>

                <div className="modal-body">
                    {/* Direction Badge */}
                    <div className={`direction-badge ${direction}`}>
                        {direction === 'up' ? (
                            <>
                                <TrendingUp size={20} />
                                <span>Going Up</span>
                            </>
                        ) : (
                            <>
                                <TrendingDown size={20} />
                                <span>Going Down</span>
                            </>
                        )}
                    </div>

                    {/* Period Selection */}
                    <div className="period-section">
                        <label>
                            <Clock size={14} />
                            Select Period (15 min)
                        </label>
                        <div className="period-options">
                            {periods.map((period, idx) => (
                                <button
                                    key={idx}
                                    className={`period-btn ${selectedPeriodIndex === idx ? 'active' : ''}`}
                                    onClick={() => setSelectedPeriodIndex(idx)}
                                >
                                    {period.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Odds Display */}
                    <div className="odds-display">
                        <div className="odds-item">
                            <span className="label">Current Odds</span>
                            <span className={`value ${direction}`}>${odds.toFixed(2)}</span>
                        </div>
                        <div className="odds-item">
                            <span className="label">Potential Return</span>
                            <span className="value highlight">${potentialWin.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Amount Input */}
                    <div className="amount-section">
                        <label>Bet Amount (USD)</label>
                        <div className="amount-input-wrapper">
                            <span className="currency">$</span>
                            <input
                                type="number"
                                value={betAmount}
                                onChange={e => setBetAmount(e.target.value)}
                                min="1"
                                max="10000"
                                placeholder="10"
                            />
                        </div>
                        <div className="quick-amounts">
                            {['10', '50', '100', '500', '1000'].map(amt => (
                                <button
                                    key={amt}
                                    className={betAmount === amt ? 'active' : ''}
                                    onClick={() => setBetAmount(amt)}
                                >
                                    ${amt}
                                </button>
                            ))}
                        </div>
                        <div className="amount-limits">
                            Min: $1 · Max: $10,000
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                    <button
                        className={`confirm-btn ${direction}`}
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Placing...' : `Predict ${direction === 'up' ? 'Up' : 'Down'}`}
                    </button>
                </div>
            </div>
        </div>
    );
};
