import React, { useState } from 'react';
import type { MacroIndicator, ImpactType } from '../../types';
import { useI18n } from '../../i18n';

import './MacroImpact.css';
import { ChevronDown, ChevronUp, Star, Calendar, Info } from 'lucide-react';

interface MacroImpactProps {
    macroData: MacroIndicator[];
}

export const MacroImpact: React.FC<MacroImpactProps> = ({ macroData }) => {
    const { t } = useI18n();
    const [expandedId, setExpandedId] = useState<string | null>(macroData[0]?.id || null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    // Category translation map
    const categoryTranslations: Record<string, string> = {
        'INFLATION': t.macroImpact.inflation,
        'EMPLOYMENT': t.macroImpact.employment,
        'MONETARY POLICY': t.macroImpact.monetaryPolicy,
        'GROWTH': t.macroImpact.growth,
    };

    // Grouping by category
    const groupedData = macroData.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, MacroIndicator[]>);

    return (
        <div className="macro-impact-section glass-panel">
            <div className="section-header">
                <h2>{t.macroImpact.title}</h2>
                <div className="info-badge">
                    <Info size={14} />
                    <span>{t.macroImpact.historicalOdds}</span>
                </div>
            </div>

            {Object.entries(groupedData).map(([category, items]) => (
                <div key={category} className="macro-category-group">
                    <h4 className="category-label">{categoryTranslations[category] || category}</h4>
                    <div className="macro-list">
                        {items.map(item => {
                            const isExpanded = expandedId === item.id;

                            return (
                                <div key={item.id} className={`macro-item ${isExpanded ? 'expanded' : ''}`}>
                                    <div className="macro-header" onClick={() => toggleExpand(item.id)}>
                                        <div className="macro-title">
                                            <div className="stars">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={12}
                                                        fill={i < item.importance ? "var(--accent-amber)" : "transparent"}
                                                        stroke={i < item.importance ? "var(--accent-amber)" : "var(--text-muted)"}
                                                    />
                                                ))}
                                            </div>
                                            <h3>{item.name}</h3>
                                        </div>
                                        <div className="macro-meta">
                                            <span className="last-release">
                                                <Calendar size={12} /> {item.lastRelease}
                                            </span>
                                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="macro-content">
                                            <div className="reactions-grid">
                                                {(['Above Expectation', 'In Line', 'Below Expectation'] as ImpactType[]).map(type => {
                                                    const reaction = item.reactions[type];
                                                    const typeLabel = type === 'Above Expectation' ? t.macroImpact.aboveExpectation :
                                                        type === 'In Line' ? t.macroImpact.inLine : t.macroImpact.belowExpectation;
                                                    return (
                                                        <div key={type} className="reaction-card">
                                                            <div className="reaction-header">
                                                                <span className={`reaction-type ${type.toLowerCase().replace(' ', '-')}`}>
                                                                    {typeLabel}
                                                                </span>
                                                            </div>
                                                            <div className="reaction-stats">
                                                                <div className="up-down-row">
                                                                    <span className="stat-up">{reaction.upCount} {t.macroImpact.up}</span>
                                                                    <span className="stat-pct up">{reaction.upProbability}%</span>
                                                                    <span className="stat-down">{reaction.downCount} {t.macroImpact.down}</span>
                                                                    <span className="stat-pct down">{reaction.downProbability}%</span>
                                                                </div>
                                                                <div className="mini-bar">
                                                                    <div className="fill up" style={{ width: `${reaction.upProbability}%` }} />
                                                                    <div className="fill down" style={{ width: `${reaction.downProbability}%` }} />
                                                                </div>
                                                                <div className="stat-row">
                                                                    <div className="stat-item">
                                                                        <span className="label">{t.macroImpact.vol}</span>
                                                                        <span className="value">±{reaction.volatilityAmplitude}%</span>
                                                                    </div>
                                                                    <div className="stat-item">
                                                                        <span className="label">{t.macroImpact.size}</span>
                                                                        <span className="value">{reaction.sampleSize}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};
