import React, { useState } from 'react';
import type { BetOption } from '../../types';
import { useI18n } from '../../i18n';
import { TrendingUp, TrendingDown, ArrowRight, ShieldCheck } from 'lucide-react';
import './BettingPanel.css';

interface BettingPanelProps {
    bets: BetOption[];
}

export const BettingPanel: React.FC<BettingPanelProps> = ({ bets }) => {
    const { t } = useI18n();
    const [selectedBetId, setSelectedBetId] = useState<string | null>(null);

    const upBets = bets.filter(b => b.direction === 'UP');
    const downBets = bets.filter(b => b.direction === 'DOWN');

    const handleSelect = (id: string) => {
        setSelectedBetId(id === selectedBetId ? null : id);
    };

    const isSelected = (id: string) => selectedBetId === id;

    return (
        <div className="betting-panel glass-panel animate-fade-in">
            <div className="panel-header">
                <h2>{t.bettingPanel.title}</h2>
                <div className="market-badge">
                    <ShieldCheck size={14} />
                    <span>{t.bettingPanel.settlementGuaranteed}</span>
                </div>
            </div>

            <div className="selection-area">
                <div className="bet-group">
                    <div className="group-label up">
                        <TrendingUp size={16} />
                        <span>{t.bettingPanel.upwardMovements}</span>
                    </div>
                    <div className="bet-cards">
                        {upBets.map(bet => (
                            <div
                                key={bet.id}
                                className={`bet-card up ${isSelected(bet.id) ? 'selected' : ''}`}
                                onClick={() => handleSelect(bet.id)}
                            >
                                <div className="card-top">
                                    <span className="range">{bet.rangeLabel}</span>
                                    <span className="odds">x{(bet.odds ?? 0).toFixed(2)}</span>
                                </div>
                                <div className="card-bottom">
                                    <span className="win-rate">{t.bettingPanel.winRate}: {bet.historicalWinRate}%</span>
                                </div>
                                {isSelected(bet.id) && <div className="check-indicator"><ArrowRight size={14} /></div>}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bet-group">
                    <div className="group-label down">
                        <TrendingDown size={16} />
                        <span>{t.bettingPanel.downwardMovements}</span>
                    </div>
                    <div className="bet-cards">
                        {downBets.map(bet => (
                            <div
                                key={bet.id}
                                className={`bet-card down ${isSelected(bet.id) ? 'selected' : ''}`}
                                onClick={() => handleSelect(bet.id)}
                            >
                                <div className="card-top">
                                    <span className="range">{bet.rangeLabel}</span>
                                    <span className="odds">x{(bet.odds ?? 0).toFixed(2)}</span>
                                </div>
                                <div className="card-bottom">
                                    <span className="win-rate">{t.bettingPanel.winRate}: {bet.historicalWinRate}%</span>
                                </div>
                                {isSelected(bet.id) && <div className="check-indicator"><ArrowRight size={14} /></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bet-action">
                <div className="odds-disclaimer">{t.bettingPanel.oddsFluctuate}</div>
                <button className={`confirm-bet-btn ${selectedBetId ? 'ready' : ''}`} disabled={!selectedBetId}>
                    {selectedBetId ? t.bettingPanel.placePrediction : t.bettingPanel.selectDirection}
                </button>
            </div>
        </div>
    );
};
