import React, { useState } from 'react';
import type { BetOption } from '../../types';
import { TrendingUp, TrendingDown, ArrowRight, ShieldCheck } from 'lucide-react';
import './BettingPanel.css';

interface BettingPanelProps {
    bets: BetOption[];
}

export const BettingPanel: React.FC<BettingPanelProps> = ({ bets }) => {
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
                <h2>Prediction Market</h2>
                <div className="market-badge">
                    <ShieldCheck size={14} />
                    <span>Settlement Guaranteed</span>
                </div>
            </div>

            <div className="selection-area">
                <div className="bet-group">
                    <div className="group-label up">
                        <TrendingUp size={16} />
                        <span>Upward Movements</span>
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
                                    <span className="odds">x{bet.odds.toFixed(2)}</span>
                                </div>
                                <div className="card-bottom">
                                    <span className="win-rate">Win Rate: {bet.historicalWinRate}%</span>
                                </div>
                                {isSelected(bet.id) && <div className="check-indicator"><ArrowRight size={14} /></div>}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bet-group">
                    <div className="group-label down">
                        <TrendingDown size={16} />
                        <span>Downward Movements</span>
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
                                    <span className="odds">x{bet.odds.toFixed(2)}</span>
                                </div>
                                <div className="card-bottom">
                                    <span className="win-rate">Win Rate: {bet.historicalWinRate}%</span>
                                </div>
                                {isSelected(bet.id) && <div className="check-indicator"><ArrowRight size={14} /></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bet-action">
                <div className="odds-disclaimer">Odds fluctuate based on real-time market sentiment.</div>
                <button className={`confirm-bet-btn ${selectedBetId ? 'ready' : ''}`} disabled={!selectedBetId}>
                    {selectedBetId ? 'Place Prediction' : 'Select Direction'}
                </button>
            </div>
        </div>
    );
};

