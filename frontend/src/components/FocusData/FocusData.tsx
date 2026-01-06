import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
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
        titleCn: '美国-实际国内生产总值[GDP](SAAR, 季增年化季环...)',
        date: '2025 Q3',
        value: '4.30',
        unit: '%',
        change: 0.5,
        description: '美国 GDP 以消费贡献近七成最高，投资、政府支出、进出口则占比各约 10～20%。',
        color: '#10b981'
    },
    {
        id: 'cpi',
        category: 'Prices',
        categoryCn: '美国-物价',
        title: 'Core CPI (SA, YoY)',
        titleCn: '美国-核心消费者物价指数[Core CPI](SA,同比)',
        date: '2025-11',
        value: '2.62',
        unit: '%',
        change: -0.08,
        description: '美国 CPI 随能源、交通运输项目波动，核心 CPI 则排除能源、食品项目。',
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
                    </div>
                ))}
            </div>
        </div>
    );
};
