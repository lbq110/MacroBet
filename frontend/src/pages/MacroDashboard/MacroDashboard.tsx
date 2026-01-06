import { useState } from 'react';
import {
    Activity,
    DollarSign,
    TrendingUp,
    TrendingDown,
    BarChart3,
    Percent,
    Globe,
    Coins,
    PieChart,
    FileText,
    ChevronDown
} from 'lucide-react';
import './MacroDashboard.css';

interface MacroItem {
    id: string;
    name: string;
    value: string;
    change: number;
    changeLabel: string;
    unit?: string;
    date?: string;
}

interface MacroCategory {
    id: string;
    title: string;
    titleCn: string;
    icon: typeof Activity;
    color: string;
    items: MacroItem[];
}

// Mock data for all 10 categories
const MACRO_CATEGORIES: MacroCategory[] = [
    {
        id: 'independent',
        title: 'Independent Indicators',
        titleCn: '独立可观测指标',
        icon: Activity,
        color: '#8b5cf6',
        items: [
            { id: 'dxy', name: '美元指数', value: '104.25', change: 0.32, changeLabel: '+0.32%' },
            { id: 'gold', name: '黄金价格', value: '2,340.50', change: -0.12, changeLabel: '-0.12%', unit: 'USD' },
            { id: 'vix', name: 'VIX 指数', value: '14.25', change: -2.34, changeLabel: '-2.34%' },
            { id: 'move', name: 'MOVE 指数', value: '95.80', change: 1.15, changeLabel: '+1.15%' },
        ]
    },
    {
        id: 'us_economy',
        title: 'US Economic Barometer',
        titleCn: '美国经济晴雨表',
        icon: BarChart3,
        color: '#10b981',
        items: [
            // GDP
            { id: 'gdp_q', name: 'GDP 季度数据', value: '4.30', change: 0.5, changeLabel: '+0.5%', unit: '%', date: '2025 Q3' },
            { id: 'real_sales', name: '实际销售月率', value: '0.8', change: 0.2, changeLabel: '+0.2%', unit: '%' },
            { id: 'pce', name: '实际个人消费支出', value: '3.1', change: 0.3, changeLabel: '+0.3%', unit: '%' },
            { id: 'ism_mfg', name: 'ISM 制造业 PMI', value: '48.2', change: -1.5, changeLabel: '-1.5', date: '2025-11' },
            { id: 'ism_svc', name: 'ISM 非制造业 PMI', value: '52.1', change: 0.8, changeLabel: '+0.8', date: '2025-11' },
            { id: 'ind_prod', name: '工业生产指数', value: '103.2', change: 0.2, changeLabel: '+0.2%' },
            { id: 'cap_util', name: '产能利用率', value: '78.5', change: -0.3, changeLabel: '-0.3%', unit: '%' },
            { id: 'inv_order', name: '制造业库存及订单', value: '1.2', change: 0.1, changeLabel: '+0.1%', unit: '%' },
            { id: 'inv_ship', name: '库存出货比', value: '1.35', change: 0.02, changeLabel: '+0.02' },
            { id: 'real_income', name: '实际个人收入减转移支付', value: '2.8', change: 0.2, changeLabel: '+0.2%', unit: '%' },
            // Labor Market
            { id: 'nfp', name: '非农就业数据', value: '64.0', change: -15, changeLabel: '-15K', unit: 'K', date: '2025-11' },
            { id: 'unemp', name: '失业率', value: '3.9', change: 0.1, changeLabel: '+0.1%', unit: '%' },
            { id: 'wage', name: '薪资增速', value: '4.2', change: -0.1, changeLabel: '-0.1%', unit: '%' },
            { id: 'claims', name: '每周初请失业金', value: '218', change: 5, changeLabel: '+5K', unit: 'K' },
            { id: 'jolts', name: '职位空缺数', value: '7.74', change: -0.2, changeLabel: '-0.2M', unit: 'M' },
            { id: 'quit', name: '主动离职率', value: '2.1', change: -0.1, changeLabel: '-0.1%', unit: '%' },
            // Inflation
            { id: 'cpi_y', name: 'CPI 年率', value: '2.7', change: 0.1, changeLabel: '+0.1%', unit: '%' },
            { id: 'core_cpi_y', name: '核心 CPI 年率', value: '2.62', change: -0.08, changeLabel: '-0.08%', unit: '%' },
            { id: 'pce_y', name: 'PCE 年率', value: '2.4', change: 0.1, changeLabel: '+0.1%', unit: '%' },
            { id: 'core_pce_y', name: '核心 PCE 年率', value: '2.8', change: 0.0, changeLabel: '0%', unit: '%' },
            { id: 'ppi_y', name: 'PPI 年率', value: '1.8', change: 0.2, changeLabel: '+0.2%', unit: '%' },
        ]
    },
    {
        id: 'liquidity',
        title: 'USD Liquidity Indicators',
        titleCn: '美元流动性指标',
        icon: DollarSign,
        color: '#3b82f6',
        items: [
            { id: 'fed_bs', name: '美联储资产负债表总量', value: '7.15', change: -0.02, changeLabel: '-0.02T', unit: 'T' },
            { id: 'tga', name: 'TGA 余额', value: '722', change: 15, changeLabel: '+15B', unit: 'B' },
            { id: 'rrp', name: 'ON RRP 余额', value: '156', change: -8, changeLabel: '-8B', unit: 'B' },
            { id: 'repo', name: 'REPO 用量', value: '85', change: 3, changeLabel: '+3B', unit: 'B' },
        ]
    },
    {
        id: 'treasury',
        title: 'US Treasury Market',
        titleCn: '美债市场指标',
        icon: FileText,
        color: '#f59e0b',
        items: [
            { id: 'us10y', name: '10年期美债收益率', value: '4.28', change: -0.05, changeLabel: '-5bp', unit: '%' },
            { id: 'us2y', name: '2年期美债收益率', value: '4.12', change: -0.08, changeLabel: '-8bp', unit: '%' },
            { id: 'tips', name: 'TIPS (实际利率)', value: '1.95', change: -0.03, changeLabel: '-3bp', unit: '%' },
            { id: 'bid_cover', name: '美债拍卖投标倍数', value: '2.45', change: 0.1, changeLabel: '+0.1' },
            { id: 'auction_rate', name: '中标利率', value: '4.32', change: 0.02, changeLabel: '+2bp', unit: '%' },
        ]
    },
    {
        id: 'rates',
        title: 'US Interest Rate Market',
        titleCn: '美国利率市场数据',
        icon: Percent,
        color: '#ec4899',
        items: [
            { id: 'ffr', name: '联邦基金目标利率', value: '3.75', change: -0.25, changeLabel: '-25bp', unit: '%' },
            { id: 'effr', name: 'EFFR', value: '3.58', change: 0.0, changeLabel: '0bp', unit: '%' },
            { id: 'iorb', name: 'IORB', value: '3.65', change: -0.25, changeLabel: '-25bp', unit: '%' },
            { id: 'sofr', name: 'SOFR', value: '3.57', change: 0.0, changeLabel: '0bp', unit: '%' },
            { id: 'srf', name: 'SRF', value: '3.75', change: -0.25, changeLabel: '-25bp', unit: '%' },
            { id: 'sofr_iorb', name: 'SOFR-IORB Spread', value: '-8', change: 1, changeLabel: '+1bp', unit: 'bp' },
        ]
    },
    {
        id: 'sentiment',
        title: 'Expectations & Sentiment',
        titleCn: '预期/情绪影响',
        icon: TrendingUp,
        color: '#06b6d4',
        items: [
            { id: 'fed_cut', name: 'Fed Watch 降息概率', value: '68.5', change: 2.3, changeLabel: '+2.3%', unit: '%' },
            { id: 'fed_year', name: 'Fed Watch 年底利率预期', value: '3.50', change: -0.25, changeLabel: '-25bp', unit: '%' },
            { id: 'powell', name: '美联储主席发言鹰鸽分析', value: '中性偏鸽', change: 0, changeLabel: '' },
            { id: 'fomc', name: '美联储票委发言鹰鸽分析', value: '分歧加大', change: 0, changeLabel: '' },
        ]
    },
    {
        id: 'global',
        title: 'Global Economy & Finance',
        titleCn: '全球经济与金融市场',
        icon: Globe,
        color: '#84cc16',
        items: [
            { id: 'boj', name: '日本央行利率决议', value: '0.25', change: 0, changeLabel: '不变', unit: '%' },
            { id: 'boj_fx', name: '日央行外汇干预分析', value: '观望', change: 0, changeLabel: '' },
            { id: 'ecb', name: '欧洲央行利率决议', value: '3.00', change: -0.25, changeLabel: '-25bp', unit: '%' },
            { id: 'boe', name: '英国央行利率决议', value: '4.75', change: 0, changeLabel: '不变', unit: '%' },
            { id: 'snb', name: '瑞士央行利率决议', value: '0.50', change: -0.25, changeLabel: '-25bp', unit: '%' },
            { id: 'boc', name: '加拿大央行利率决议', value: '3.25', change: -0.50, changeLabel: '-50bp', unit: '%' },
            { id: 'riksbank', name: '瑞典央行利率决议', value: '2.75', change: -0.25, changeLabel: '-25bp', unit: '%' },
        ]
    },
    {
        id: 'futures',
        title: 'Futures Market Data',
        titleCn: '期货市场数据',
        icon: BarChart3,
        color: '#f97316',
        items: [
            { id: 'oi_btc', name: 'BTC 未平仓合约', value: '42.5', change: 2.3, changeLabel: '+2.3B', unit: 'B' },
            { id: 'oi_eth', name: 'ETH 未平仓合约', value: '18.2', change: 1.1, changeLabel: '+1.1B', unit: 'B' },
            { id: 'options', name: '期权持仓及交割数据', value: '大额看涨', change: 0, changeLabel: '' },
        ]
    },
    {
        id: 'onchain',
        title: 'On-Chain Data',
        titleCn: '链上数据',
        icon: Coins,
        color: '#a855f7',
        items: [
            { id: 'usdt_mint', name: 'USDT 铸造量 (7D)', value: '1.2', change: 0.5, changeLabel: '+0.5B', unit: 'B' },
            { id: 'usdc_mint', name: 'USDC 铸造量 (7D)', value: '0.8', change: 0.3, changeLabel: '+0.3B', unit: 'B' },
            { id: 'stablecoin', name: '稳定币总市值', value: '192.5', change: 2.1, changeLabel: '+2.1B', unit: 'B' },
        ]
    },
    {
        id: 'etf',
        title: 'ETF Data',
        titleCn: 'ETF 数据',
        icon: PieChart,
        color: '#ef4444',
        items: [
            { id: 'btc_etf', name: 'BTC ETF 净流入', value: '520', change: 120, changeLabel: '+120M', unit: 'M' },
            { id: 'eth_etf', name: 'ETH ETF 净流入', value: '85', change: 25, changeLabel: '+25M', unit: 'M' },
        ]
    },
];

export const MacroDashboard = () => {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
        new Set(MACRO_CATEGORIES.map(c => c.id))
    );

    const toggleCategory = (categoryId: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
        } else {
            newExpanded.add(categoryId);
        }
        setExpandedCategories(newExpanded);
    };

    return (
        <div className="macro-dashboard">
            <div className="categories-container">
                {MACRO_CATEGORIES.map(category => {
                    const Icon = category.icon;
                    const isExpanded = expandedCategories.has(category.id);

                    return (
                        <div key={category.id} className="category-section">
                            <div
                                className="category-header"
                                onClick={() => toggleCategory(category.id)}
                                style={{ '--category-color': category.color } as React.CSSProperties}
                            >
                                <div className="category-title">
                                    <div className="category-icon" style={{ background: `linear-gradient(135deg, ${category.color}, ${category.color}88)` }}>
                                        <Icon size={18} />
                                    </div>
                                    <h2>{category.titleCn}</h2>
                                </div>
                                <div className="category-meta">
                                    <span className="item-count">{category.items.length}</span>
                                    <ChevronDown size={18} className={`chevron ${isExpanded ? 'expanded' : ''}`} />
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="category-items">
                                    {category.items.map(item => (
                                        <div key={item.id} className="macro-item">
                                            <span className="item-name">{item.name}</span>
                                            <div className="item-value-group">
                                                <span className="item-value">{item.value}</span>
                                                {item.unit && <span className="item-unit">{item.unit}</span>}
                                            </div>
                                            {item.changeLabel && (
                                                <span className={`item-change ${item.change >= 0 ? 'positive' : 'negative'}`}>
                                                    {item.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                                    {item.changeLabel}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
