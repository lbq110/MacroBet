import React, { useState } from 'react';
import type { MacroIndicator, ImpactType } from '../../types';

import { MacroStatsChart } from './MacroStatsChart';
import './MacroImpact.css';
import { ChevronDown, ChevronUp, Star, Calendar, Info } from 'lucide-react';

interface MacroImpactProps {
    macroData: MacroIndicator[];
}

export const MacroImpact: React.FC<MacroImpactProps> = ({ macroData }) => {
    const [expandedId, setExpandedId] = useState<string | null>(macroData[0]?.id || null);
    const [activeTab, setActiveTab] = useState<Record<string, ImpactType>>({});

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const getActiveTab = (id: string) => activeTab[id] || 'Above Expectation';

    const handleTabChange = (id: string, tab: ImpactType) => {
        setActiveTab(prev => ({ ...prev, [id]: tab }));
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
                <h2>Macro Data Impact</h2>
                <div className="info-badge">
                    <Info size={14} />
                    <span>Historical Odds Only</span>
                </div>
            </div>

            {Object.entries(groupedData).map(([category, items]) => (
                <div key={category} className="macro-category-group">
                    <h4 className="category-label">{category}</h4>
                    <div className="macro-list">
                        {items.map(item => {
                            const isExpanded = expandedId === item.id;
                            const currentTab = getActiveTab(item.id);
                            const currentReaction = item.reactions[currentTab];

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
                                            <div className="impact-tabs">
                                                {(['Above Expectation', 'In Line', 'Below Expectation'] as ImpactType[]).map(tab => (
                                                    <button
                                                        key={tab}
                                                        className={`tab-btn ${currentTab === tab ? 'active' : ''}`}
                                                        onClick={() => handleTabChange(item.id, tab)}
                                                    >
                                                        {tab}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="reaction-view">
                                                <MacroStatsChart reaction={currentReaction} />
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


