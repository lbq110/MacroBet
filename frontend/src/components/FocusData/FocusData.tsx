import { Calendar, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import './FocusData.css';

interface FocusDataItem {
    id: string;
    category: string;
    categoryCn: string;
    title: string;
    titleCn: string;
    date: string;
    value: string;
    unit: string;
    change: number;
    description: string;
    color: string;
}

const FOCUS_DATA: FocusDataItem[] = [
    {
        id: 'gdp',
        category: 'GDP',
        categoryCn: '美国-GDP综合指标',
        title: 'Real GDP (SAAR)',
        titleCn: '美国-实际国内生产总值[GDP](SAAR, 季增年化季环...',
        date: '2025 Q3',
        value: '4.30',
        unit: '%',
        change: 0.5,
        description: '美国 GDP 以消费贡献近七成最高，投资、政府支出、进出口则占比各约 10～20%。',
        color: '#10b981'
    },
    {
        id: 'retail',
        category: 'Consumption',
        categoryCn: '美国-消费',
        title: 'Retail Sales (YoY)',
        titleCn: '美国-零售销售(同比)',
        date: '2025-10',
        value: '3.47',
        unit: '%',
        change: 0.2,
        description: '美国 GDP 以消费贡献近七成最高，因此消费状况将显著影响美国经济基本面。',
        color: '#10b981'
    },
    {
        id: 'nfp',
        category: 'Employment',
        categoryCn: '美国-就业',
        title: 'Non-Farm Payrolls',
        titleCn: '美国-非农就业人数(月变动)',
        date: '2025-11',
        value: '64.0',
        unit: 'K',
        change: -15,
        description: '美国就业市场为经济命脉，因为会直接影响到占美国七成 GDP 的消费。',
        color: '#10b981'
    },
    {
        id: 'cpi',
        category: 'Prices',
        categoryCn: '美国-物价',
        title: 'Core CPI (SA, YoY)',
        titleCn: '美国-核心消费者物价指数[Core CPI](SA,同比)',
        date: '2025-09',
        value: '2.62',
        unit: '%',
        change: -0.08,
        description: '美国 CPI 随能源、交通运输项目波动，核心 CPI 则排除能源、食品项目。',
        color: '#10b981'
    },
    {
        id: 'trade',
        category: 'Trade',
        categoryCn: '美国-对外贸易',
        title: 'Imports (YoY)',
        titleCn: '美国-进口-商品&服务(同比)',
        date: '2025-09',
        value: '-3.67',
        unit: '%',
        change: -1.2,
        description: '经济快速增速及制造业外移，加上美国为消费大国，使得美国长期贸易逆差。',
        color: '#ef4444'
    },
    {
        id: 'housing',
        category: 'Real Estate',
        categoryCn: '美国-房地产',
        title: 'S&P Case-Shiller HPI',
        titleCn: '美国-S&P全国房价指数(同比)',
        date: '2025-10',
        value: '1.37',
        unit: '%',
        change: 0.15,
        description: '美国房市 18 年一循环，并受到房贷利率、放款意愿及库存月数影响。',
        color: '#10b981'
    },
    {
        id: 'ism',
        category: 'Manufacturing',
        categoryCn: '美国-制造/服务',
        title: 'ISM Manufacturing PMI',
        titleCn: '美国-ISM制造业指数[PMI]',
        date: '2025-11',
        value: '48.2',
        unit: '',
        change: -1.5,
        description: '美国以服务业为主，而制造业则影响全球制造景气。',
        color: '#f59e0b'
    },
    {
        id: 'buffett',
        category: 'Market',
        categoryCn: '美国-市场指标',
        title: 'Buffett Indicator',
        titleCn: '美国-巴菲特指标',
        date: '2026-01-02',
        value: '220.1',
        unit: '%',
        change: 5.2,
        description: '市场指标中，可观察波动指数、违约风险以及美股投资情绪状况等。',
        color: '#ef4444'
    },
    {
        id: 'fed_rate',
        category: 'Fed',
        categoryCn: '美国-美联储',
        title: 'Fed Target Rate Upper',
        titleCn: '美国-美联储目标利率上限',
        date: '2026-01-01',
        value: '3.75',
        unit: '%',
        change: -0.25,
        description: '美联储专区收录与货币政策决策相关的重要指标。',
        color: '#10b981'
    },
];

export const FocusData = () => {
    return (
        <div className="focus-data">
            <div className="focus-header">
                <div className="header-left">
                    <Calendar size={24} />
                    <div>
                        <h2>近期焦点数据</h2>
                        <span className="subtitle">Recent Focus Data (3 Months)</span>
                    </div>
                </div>
            </div>

            <div className="focus-grid">
                {FOCUS_DATA.map(item => (
                    <div key={item.id} className="focus-card">
                        <div className="card-header">
                            <span className="card-category" style={{ color: item.color }}>
                                {item.categoryCn}
                            </span>
                        </div>
                        <div className="card-title">{item.titleCn}</div>
                        <div className="card-date">{item.date}</div>
                        <div className="card-value-section">
                            <span className="value" style={{ color: item.color }}>
                                {item.value}
                            </span>
                            <span className="unit">{item.unit}</span>
                            <span className={`change-icon ${item.change >= 0 ? 'up' : 'down'}`}>
                                {item.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            </span>
                        </div>
                        <div className="card-description">{item.description}</div>
                        <button className="view-more-btn">
                            看更多 <ChevronRight size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
