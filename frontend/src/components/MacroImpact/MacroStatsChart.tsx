import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Cell
} from 'recharts';
import type { PriceReaction } from '../../types';


interface MacroStatsChartProps {
    reaction: PriceReaction;
}

export const MacroStatsChart: React.FC<MacroStatsChartProps> = ({ reaction }) => {
    const data = reaction.history.map(item => ({
        ...item,
        formattedDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    }));

    // If no history, show empty state or mock some pattern for visualization if this was real
    // For now, we rely on mock data having history.

    return (
        <div className="stats-chart-container">
            <div className="stats-summary">
                <div className="stat-item sentiment">
                    <div className="sentiment-split">
                        <div className="up">
                            <span className="count">{reaction.upCount} Up</span>
                            <span className="pct">{reaction.upProbability}%</span>
                        </div>
                        <div className="down">
                            <span className="count">{reaction.downCount} Down</span>
                            <span className="pct">{reaction.downProbability}%</span>
                        </div>
                    </div>
                    <div className="multi-progress">
                        <div className="fill up" style={{ width: `${reaction.upProbability}%` }} />
                        <div className="fill down" style={{ width: `${reaction.downProbability}%` }} />
                    </div>
                </div>
                <div className="stat-grid">
                    <div className="small-stat">
                        <span className="label">Avg Volatility</span>
                        <span className="value">±{reaction.volatilityAmplitude}%</span>
                    </div>
                    <div className="small-stat">
                        <span className="label">Sample Size</span>
                        <span className="value">{reaction.sampleSize}</span>
                    </div>
                </div>
            </div>


            <div className="chart-wrapper" style={{ height: 200, width: '100%' }}>
                <ResponsiveContainer>
                    <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
                        <XAxis
                            dataKey="formattedDate"
                            tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }}
                            axisLine={false}
                            tickLine={false}
                            unit="%"
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--bg-tertiary)',
                                borderColor: 'var(--border-color)',
                                color: 'var(--text-primary)',
                                fontSize: '12px'
                            }}
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        />
                        <ReferenceLine y={0} stroke="var(--text-tertiary)" />
                        <Bar dataKey="priceChange" radius={[2, 2, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.priceChange >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="chart-caption">Historical Price Reaction (T+30m)</div>

        </div>
    );
};
