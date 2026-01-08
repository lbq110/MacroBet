import React, { useState, useEffect, useMemo } from 'react';
import { Target, Zap, Trophy, Timer, AlertCircle, TrendingUp, TrendingDown, Minus, Share2 } from 'lucide-react';
import type { ShockwaveEvent } from '../../types';
import { EventStatus, ShockwaveSubMode } from '../../types';
import { useI18n } from '../../i18n';
import { useOdds } from '../../hooks/useOdds';
import './ShockwavePanel.css';

interface ShockwavePanelProps {
    event: ShockwaveEvent;
}

export const ShockwavePanel: React.FC<ShockwavePanelProps> = ({ event }) => {
    const { t } = useI18n();
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    const [activeMode, setActiveMode] = useState<string | null>(null);

    // Betting modal state
    const [showBetModal, setShowBetModal] = useState(false);
    const [betAmount, setBetAmount] = useState<string>('10');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch real-time odds (3 second refresh)
    const { odds } = useOdds(event.id, 3000);

    // Countdown Logic
    useEffect(() => {
        const calculateTime = () => {
            const release = new Date(event.releaseTime).getTime();
            const now = new Date().getTime();
            setTimeLeft(Math.max(0, Math.floor((release - now) / 1000)));
        };

        calculateTime();
        const timer = setInterval(calculateTime, 1000);
        return () => clearInterval(timer);
    }, [event.releaseTime]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const isUrgent = timeLeft < 300; // Under 5 mins
    const isLocked = event.status === EventStatus.LOCKED || event.status === EventStatus.LIVE || event.status === EventStatus.SETTLING;

    const sniperOptions = useMemo(() => event.options.filter(o => o.subMode === ShockwaveSubMode.DATA_SNIPER), [event.options]);
    const volOptions = useMemo(() => event.options.filter(o => o.subMode === ShockwaveSubMode.VOLATILITY_HUNTER), [event.options]);
    const jackpotOptions = useMemo(() => event.options.filter(o => o.subMode === ShockwaveSubMode.JACKPOT), [event.options]);

    // Helper function to get pool share display
    const getPoolShare = (mode: 'dataSniper' | 'volatilityHunter' | 'jackpot', rangeLabel: string): string => {
        if (!odds || !odds[mode]) {
            return '---';
        }
        const modeOdds = odds[mode];
        const total = Object.values(modeOdds).reduce((sum, v) => sum + v, 0);
        if (total === 0) return '33%'; // Default equal split
        const share = (modeOdds[rangeLabel] || 0) / total * 100;
        return `${share.toFixed(0)}%`;
    };

    const handleSelect = (mode: string, optionId: string) => {
        if (isLocked) return;

        // If switching to a different mode, clear previous selection and set new mode
        if (activeMode !== mode) {
            setActiveMode(mode);
            setSelectedOptions({ [mode]: optionId });
        } else {
            // Same mode, just update the option
            setSelectedOptions(prev => ({ ...prev, [mode]: optionId }));
        }
    };

    const clearSelection = () => {
        setActiveMode(null);
        setSelectedOptions({});
    };

    const handleShareToX = () => {
        const prediction = activeMode
            ? `My prediction: ${activeMode.toUpperCase()}`
            : 'Check out this CPI Shockwave event!';
        const text = `🚀 CPI Shockwave on MacroBet\n\n📊 Expected: ${event.expectedValue}\n⏰ Release: ${new Date(event.releaseTime).toLocaleString()}\n\n${prediction}\n\n#MacroBet #CPI #Trading`;
        const url = 'https://macrobet.io';
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(twitterUrl, '_blank', 'width=550,height=420');
    };

    const isModeDisabled = (mode: string) => {
        return activeMode !== null && activeMode !== mode;
    };

    // Handle clicking on the box itself (empty space) to switch modes
    const handleBoxClick = (mode: string, defaultOptionId: string) => {
        if (isLocked) return;
        if (activeMode !== mode) {
            setActiveMode(mode);
            setSelectedOptions({ [mode]: defaultOptionId });
        }
    };

    // Open betting modal
    const openBetModal = () => {
        if (Object.keys(selectedOptions).length === 0) return;
        setShowBetModal(true);
    };

    // Close betting modal
    const closeBetModal = () => {
        setShowBetModal(false);
        setBetAmount('10');
    };

    // Handle bet submission
    const handleBetSubmit = async () => {
        const amount = parseFloat(betAmount);
        if (isNaN(amount) || amount < 1) {
            alert('Please enter a valid amount (minimum $1)');
            return;
        }

        setIsSubmitting(true);

        // Get selected option details
        const selectedOptionId = Object.values(selectedOptions)[0];
        const selectedOption = event.options.find(o => o.id === selectedOptionId);

        // For now, show confirmation (in production, this would call the backend API)
        setTimeout(() => {
            setIsSubmitting(false);
            setShowBetModal(false);
            setBetAmount('10');
            clearSelection();
            alert(`✅ Bet placed!\n\nMode: ${activeMode?.toUpperCase()}\nOption: ${selectedOption?.rangeLabel}\nAmount: $${amount}`);
        }, 500);
    };

    // Get selected option for modal display
    const getSelectedOptionDetails = () => {
        if (!activeMode || !selectedOptions[activeMode]) return null;
        const optionId = selectedOptions[activeMode];
        return event.options.find(o => o.id === optionId);
    };

    return (
        <div className={`shockwave-panel glass-panel ${event.status.toLowerCase()}`}>
            {/* Countdown Header */}
            <div className="shockwave-header">
                <div className="header-left">
                    <div className="live-indicator">
                        <span className="dot"></span>
                        {t.shockwave.live}
                    </div>
                    <h1>{event.indicatorName} {t.shockwave.title}</h1>
                </div>
                <div className={`countdown-display ${isUrgent ? 'urgent' : ''}`}>
                    <Timer size={24} />
                    <span className="timer-text">{formatTime(timeLeft)}</span>
                </div>
            </div>

            {/* Event Stats Card */}
            <div className="event-stats-card glass-card">
                <div className="stat-item">
                    <span className="label">{t.shockwave.expected}</span>
                    <span className="value">{event.expectedValue}%</span>
                </div>
                <div className="stat-separator"></div>
                <div className="stat-item">
                    <span className="label">{t.shockwave.basePrice} (BTC)</span>
                    <span className="value">${event.basePrice?.toLocaleString() || '---'}</span>
                </div>
                <div className="stat-separator"></div>
                <div className="stat-item status">
                    <span className="label">{t.shockwave.marketStatus}</span>
                    <span className={`status-tag ${event.status.toLowerCase()}`}>
                        {event.status === EventStatus.BETTING ? t.shockwave.betting :
                            event.status === EventStatus.LOCKED ? t.shockwave.locked :
                                event.status === EventStatus.SETTLING ? t.shockwave.settling : t.shockwave.settled}
                    </span>
                </div>
            </div>

            <div className="game-modes-grid">
                {/* 玩法 A: Data Sniper */}
                <div
                    className={`game-box ${isModeDisabled('sniper') ? 'mode-disabled' : ''} ${activeMode === 'sniper' ? 'mode-active' : ''}`}
                    onClick={() => sniperOptions[0] && handleBoxClick('sniper', sniperOptions[0].id)}
                >
                    <div className="box-title">
                        <Target size={18} className="icon-sniper" />
                        <span>{t.shockwave.dataSniper}</span>
                        <span className="badge">{t.shockwave.pariMutuel}</span>
                    </div>
                    <div className="sniper-options">
                        {sniperOptions.map(opt => (
                            <button
                                key={opt.id}
                                className={`option-btn ${opt.rangeLabel.toLowerCase()} ${selectedOptions['sniper'] === opt.id ? 'active' : ''}`}
                                onClick={() => handleSelect('sniper', opt.id)}
                                disabled={isLocked}
                            >
                                {opt.rangeLabel === 'DOVISH' && <TrendingUp size={16} />}
                                {opt.rangeLabel === 'HAWKISH' && <TrendingDown size={16} />}
                                {opt.rangeLabel === 'NEUTRAL' && <Minus size={16} />}
                                <div className="label-col">
                                    <span className="main-lab">
                                        {opt.rangeLabel === 'DOVISH' ? t.shockwave.dovish :
                                            opt.rangeLabel === 'NEUTRAL' ? t.shockwave.neutral : t.shockwave.hawkish}
                                    </span>
                                    <span className="odds">{t.shockwave.poolShare}: {getPoolShare('dataSniper', opt.rangeLabel)}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 玩法 B: Volatility Hunter */}
                <div
                    className={`game-box ${isModeDisabled('vol') ? 'mode-disabled' : ''} ${activeMode === 'vol' ? 'mode-active' : ''}`}
                    onClick={() => volOptions[0] && handleBoxClick('vol', volOptions[0].id)}
                >
                    <div className="box-title">
                        <Zap size={18} className="icon-vol" />
                        <span>{t.shockwave.volatilityHunter}</span>
                    </div>
                    <div className="vol-options">
                        {volOptions.map(opt => (
                            <button
                                key={opt.id}
                                className={`vol-btn ${selectedOptions['vol'] === opt.id ? 'active' : ''}`}
                                onClick={() => handleSelect('vol', opt.id)}
                                disabled={isLocked}
                            >
                                <span className="vol-lab">
                                    {opt.rangeLabel === 'CALM' ? t.shockwave.calm : t.shockwave.tsunami}
                                </span>
                                <span className="vol-sub">
                                    {opt.rangeLabel === 'TSUNAMI' ? t.shockwave.tsunamiDesc : t.shockwave.calmDesc}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 玩法 C: Jackpot */}
                <div
                    className={`game-box jackpot-box ${isModeDisabled('jackpot') ? 'mode-disabled' : ''} ${activeMode === 'jackpot' ? 'mode-active' : ''}`}
                    onClick={() => jackpotOptions[0] && handleBoxClick('jackpot', jackpotOptions[0].id)}
                >
                    <div className="box-title">
                        <Trophy size={18} className="icon-jackpot" />
                        <span>{t.shockwave.jackpot}</span>
                        <span className="badge-jackpot">{t.shockwave.potential}</span>
                    </div>
                    <div className="jackpot-scroll">
                        {jackpotOptions.map(opt => (
                            <div
                                key={opt.id}
                                className={`jackpot-item ${selectedOptions['jackpot'] === opt.id ? 'active' : ''}`}
                                onClick={() => handleSelect('jackpot', opt.id)}
                            >
                                <span>{opt.rangeLabel}</span>
                                <span className="odds-badge">{opt.odds}x</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Betting Slip Area */}
            <div className="shockwave-footer">
                <div className="info-tip">
                    <AlertCircle size={14} />
                    <span>{t.shockwave.lockPhase} {formatTime(timeLeft - 900 < 0 ? 0 : timeLeft - 900)}. {t.shockwave.noCancel}</span>
                </div>

                <div className="footer-primary-row">
                    <button
                        className={`bet-btn-shockwave ${Object.keys(selectedOptions).length > 0 ? 'ready' : ''}`}
                        disabled={isLocked || Object.keys(selectedOptions).length === 0}
                        onClick={openBetModal}
                    >
                        {isLocked ? t.shockwave.bettingLocked : t.shockwave.confirmBets}
                    </button>
                </div>

                {/* Secondary Actions Row */}
                <div className="footer-secondary-row">
                    {activeMode && (
                        <button className="clear-selection-link" onClick={clearSelection}>
                            ✕ {t.shockwave.clearSelection}
                        </button>
                    )}
                    <button className="share-x-btn-minimal" onClick={handleShareToX} title="Share to X">
                        <Share2 size={16} />
                        <span>{t.shockwave.share}</span>
                    </button>
                </div>
            </div>

            {/* Betting Modal */}
            {showBetModal && (
                <div className="bet-modal-overlay" onClick={closeBetModal}>
                    <div className="bet-modal" onClick={e => e.stopPropagation()}>
                        <div className="bet-modal-header">
                            <h3>🎯 Confirm Your Bet</h3>
                            <button className="close-btn" onClick={closeBetModal}>✕</button>
                        </div>
                        <div className="bet-modal-body">
                            <div className="bet-info">
                                <div className="info-row">
                                    <span className="label">Event:</span>
                                    <span className="value">{event.indicatorName} Shockwave</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Mode:</span>
                                    <span className="value mode-badge">
                                        {activeMode === 'sniper' ? '🎯 Data Sniper' :
                                            activeMode === 'vol' ? '🌊 Volatility Hunter' : '🎰 Jackpot'}
                                    </span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Selection:</span>
                                    <span className="value selection-badge">
                                        {getSelectedOptionDetails()?.rangeLabel}
                                    </span>
                                </div>
                                {activeMode === 'jackpot' && (
                                    <div className="info-row">
                                        <span className="label">Odds:</span>
                                        <span className="value odds-value">
                                            {getSelectedOptionDetails()?.odds}x
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="bet-amount-section">
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
                                    {['10', '50', '100', '500'].map(amt => (
                                        <button
                                            key={amt}
                                            className={betAmount === amt ? 'active' : ''}
                                            onClick={() => setBetAmount(amt)}
                                        >
                                            ${amt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {activeMode === 'jackpot' && (
                                <div className="potential-win">
                                    <span>Potential Win:</span>
                                    <span className="win-amount">
                                        ${(parseFloat(betAmount || '0') * (getSelectedOptionDetails()?.odds || 0)).toFixed(2)}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="bet-modal-footer">
                            <button className="cancel-btn" onClick={closeBetModal}>Cancel</button>
                            <button
                                className="confirm-btn"
                                onClick={handleBetSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Placing...' : 'Place Bet'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
