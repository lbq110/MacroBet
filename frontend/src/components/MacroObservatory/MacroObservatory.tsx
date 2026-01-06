import { TrendingUp, TrendingDown, Activity, DollarSign, Percent, BarChart3 } from 'lucide-react';
import './MacroObservatory.css';

interface ObservatoryItem {
    id: string;
    name: string;
    nameCn: string;
    value: string;
    change: number;
    changeLabel: string;
    icon: typeof TrendingUp;
    category: 'fed' | 'yield' | 'index';
}

const OBSERVATORY_DATA: ObservatoryItem[] = [
    // Fed Watch
    { id: 'fed_cut_prob', name: 'Fed Rate Cut Probability', nameCn: 'Fed Watch 降息概率', value: '68.5%', change: 2.3, changeLabel: '+2.3%', icon: Percent, category: 'fed' },
    { id: 'fed_year_end', name: 'Year-End Rate Expectation', nameCn: 'Fed Watch 年底利率预期', value: '3.75%', change: -0.25, changeLabel: '-25bp', icon: Activity, category: 'fed' },

    // Yields
    { id: 'dxy', name: 'US Dollar Index', nameCn: '美元指数', value: '104.25', change: 0.32, changeLabel: '+0.32%', icon: DollarSign, category: 'yield' },
    { id: 'us10y', name: 'US 10Y Treasury Yield', nameCn: '美国10年期国债收益率', value: '4.28%', change: -0.05, changeLabel: '-5bp', icon: TrendingDown, category: 'yield' },
    { id: 'us2y', name: 'US 2Y Treasury Yield', nameCn: '美国2年期国债收益率', value: '4.12%', change: -0.08, changeLabel: '-8bp', icon: TrendingDown, category: 'yield' },

    // Indices
    { id: 'spx', name: 'S&P 500', nameCn: 'S&P 500 指数', value: '5,123.45', change: 0.85, changeLabel: '+0.85%', icon: BarChart3, category: 'index' },
    { id: 'nas100', name: 'Nasdaq 100', nameCn: 'NAS100 指数', value: '18,245.30', change: 1.12, changeLabel: '+1.12%', icon: BarChart3, category: 'index' },
    { id: 'mag7', name: 'Mag 7 Index', nameCn: 'Mag7 指数', value: '12,450.80', change: 1.45, changeLabel: '+1.45%', icon: TrendingUp, category: 'index' },
    { id: 'russ2000', name: 'Russell 2000', nameCn: 'RUSS2000 指数', value: '2,234.56', change: -0.23, changeLabel: '-0.23%', icon: BarChart3, category: 'index' },
];

export const MacroObservatory = () => {
    const fedData = OBSERVATORY_DATA.filter(d => d.category === 'fed');
    const yieldData = OBSERVATORY_DATA.filter(d => d.category === 'yield');
    const indexData = OBSERVATORY_DATA.filter(d => d.category === 'index');

    return (
        <div className="macro-observatory">
            <div className="observatory-header">
                <div className="header-icon">
                    <Activity size={24} />
                </div>
                <div className="header-text">
                    <h2>宏观观察站</h2>
                    <span className="subtitle">Macro Observatory</span>
                </div>
                <div className="live-indicator">
                    <span className="pulse"></span>
                    <span>LIVE</span>
                </div>
            </div>

            {/* Fed Watch Section */}
            <div className="observatory-section">
                <h3 className="section-title">Fed Watch</h3>
                <div className="observatory-grid fed-grid">
                    {fedData.map(item => (
                        <div key={item.id} className="observatory-card fed">
                            <div className="card-icon">
                                <item.icon size={20} />
                            </div>
                            <div className="card-content">
                                <span className="card-label">{item.nameCn}</span>
                                <div className="card-value-row">
                                    <span className="card-value">{item.value}</span>
                                    <span className={`card-change ${item.change >= 0 ? 'positive' : 'negative'}`}>
                                        {item.changeLabel}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Yields Section */}
            <div className="observatory-section">
                <h3 className="section-title">国债收益率 & 美元</h3>
                <div className="observatory-grid yield-grid">
                    {yieldData.map(item => (
                        <div key={item.id} className="observatory-card yield">
                            <div className="card-icon">
                                <item.icon size={20} />
                            </div>
                            <div className="card-content">
                                <span className="card-label">{item.nameCn}</span>
                                <div className="card-value-row">
                                    <span className="card-value">{item.value}</span>
                                    <span className={`card-change ${item.change >= 0 ? 'positive' : 'negative'}`}>
                                        {item.changeLabel}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Indices Section */}
            <div className="observatory-section">
                <h3 className="section-title">市场指数</h3>
                <div className="observatory-grid index-grid">
                    {indexData.map(item => (
                        <div key={item.id} className="observatory-card index">
                            <div className="card-icon">
                                <item.icon size={20} />
                            </div>
                            <div className="card-content">
                                <span className="card-label">{item.nameCn}</span>
                                <div className="card-value-row">
                                    <span className="card-value">{item.value}</span>
                                    <span className={`card-change ${item.change >= 0 ? 'positive' : 'negative'}`}>
                                        {item.changeLabel}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
