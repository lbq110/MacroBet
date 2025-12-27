import React, { useState, useEffect, useMemo } from 'react';
import { Target, Zap, Trophy, Timer, AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { ShockwaveEvent } from '../../types';
import { EventStatus, ShockwaveSubMode } from '../../types';
import './ShockwavePanel.css';

interface ShockwavePanelProps {
    event: ShockwaveEvent;
}

export const ShockwavePanel: React.FC<ShockwavePanelProps> = ({ event }) => {
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

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
        setSelectedOptions(prev => ({ ...prev, [mode]: optionId }));
    };

    return (
        <div className={`shockwave-panel glass-panel ${event.status.toLowerCase()}`}>
            {/* Countdown Header */}
            <div className="shockwave-header">
                <div className="header-left">
                    <div className="live-indicator">
                        <span className="dot"></span>
                        LIVE
                    </div>
                    <h1>{event.indicatorName} SHOCKWAVE</h1>
                </div>
                <div className={`countdown-display ${isUrgent ? 'urgent' : ''}`}>
                    <Timer size={24} />
                    <span className="timer-text">{formatTime(timeLeft)}</span>
                </div>
            </div>

            {/* Event Stats Card */}
            <div className="event-stats-card glass-card">
                <div className="stat-item">
                    <span className="label">EXPECTED</span>
                    <span className="value">{event.expectedValue}%</span>
                </div>
                <div className="stat-separator"></div>
                <div className="stat-item">
                    <span className="label">BASE PRICE (BTC)</span>
                    <span className="value">${event.basePrice?.toLocaleString() || '---'}</span>
                </div>
                <div className="stat-separator"></div>
                <div className="stat-item status">
                    <span className="label">MARKET STATUS</span>
                    <span className={`status-tag ${event.status.toLowerCase()}`}>
                        {event.status}
                    </span>
                </div>
            </div>

            <div className="game-modes-grid">
                {/* 玩法 A: Data Sniper */}
                <div className="game-box">
                    <div className="box-title">
                        <Target size={18} className="icon-sniper" />
                        <span>Data Sniper</span>
                        <span className="badge">Pari-mutuel</span>
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
                                    <span className="main-lab">{opt.rangeLabel}</span>
                                    <span className="odds">Pool Share: 35%</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 玩法 B: Volatility Hunter */}
                <div className="game-box">
                    <div className="box-title">
                        <Zap size={18} className="icon-vol" />
                        <span>Volatility Hunter</span>
                    </div>
                    <div className="vol-options">
                        {volOptions.map(opt => (
                            <button
                                key={opt.id}
                                className={`vol-btn ${selectedOptions['vol'] === opt.id ? 'active' : ''}`}
                                onClick={() => handleSelect('vol', opt.id)}
                                disabled={isLocked}
                            >
                                <span className="vol-lab">{opt.rangeLabel}</span>
                                <span className="vol-sub">
                                    {opt.rangeLabel === 'TSUNAMI' ? '> $1000 Move' : '< $200 Calm'}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 玩法 C: Jackpot */}
                <div className="game-box jackpot-box">
                    <div className="box-title">
                        <Trophy size={18} className="icon-jackpot" />
                        <span>Jackpot</span>
                        <span className="badge-jackpot">100x Potential</span>
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
                    <span>Locked phase starts in {formatTime(timeLeft - 900 < 0 ? 0 : timeLeft - 900)}. No cancellations after lock.</span>
                </div>
                <button
                    className={`bet-btn-shockwave ${Object.keys(selectedOptions).length > 0 ? 'ready' : ''}`}
                    disabled={isLocked || Object.keys(selectedOptions).length === 0}
                >
                    {isLocked ? 'BETTING LOCKED' : 'CONFIRM SHOCKWAVE BETS'}
                </button>
            </div>
        </div>
    );
};
