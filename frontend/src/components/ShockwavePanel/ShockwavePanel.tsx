import React, { useState, useEffect, useMemo } from 'react';
import { Target, Zap, Trophy, Timer, AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { ShockwaveEvent } from '../../types';
import { EventStatus, ShockwaveSubMode } from '../../types';
import { useI18n } from '../../i18n';
import './ShockwavePanel.css';

interface ShockwavePanelProps {
    event: ShockwaveEvent;
}

export const ShockwavePanel: React.FC<ShockwavePanelProps> = ({ event }) => {
    const { t } = useI18n();
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    const [activeMode, setActiveMode] = useState<string | null>(null);

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
                                    <span className="odds">{t.shockwave.poolShare}: 35%</span>
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
                {activeMode && (
                    <button className="clear-selection-btn" onClick={clearSelection}>
                        {t.shockwave.clearSelection}
                    </button>
                )}
                <button
                    className={`bet-btn-shockwave ${Object.keys(selectedOptions).length > 0 ? 'ready' : ''}`}
                    disabled={isLocked || Object.keys(selectedOptions).length === 0}
                >
                    {isLocked ? t.shockwave.bettingLocked : t.shockwave.confirmBets}
                </button>
            </div>
        </div>
    );
};
