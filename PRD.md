# MacroBet - 产品需求文档 (PRD)

## 📌 产品概述

### 产品名称
**MacroBet** - 宏观数据驱动的资产预测平台

### 产品定位
MacroBet 是一个创新的数据驱动型预测平台，通过展示宏观经济数据发布后资产价格的**历史统计表现**，帮助用户做出更明智的资产涨跌预测与下注决策。

### 核心价值主张
- **数据驱动决策**：基于 30 年历史统计数据，提供科学的预测参考
- **实时事件下注**：抓住 CPI、NFP、GDP 等重大宏观事件发布时刻
- **三重博弈玩法**：数据狙击手 + 波动猎人 + 精准点位，满足不同风险偏好

---

## 🎯 核心功能

### 1. 仪表盘 (Dashboard)

主页面包含三大核心模块：

#### 1.1 Shockwave 冲击波下注面板
实时展示即将发布的宏观经济事件，支持三种下注玩法：

| 玩法 | 名称 | 逻辑 | 特点 |
|------|------|------|------|
| A | **数据狙击手 (Data Sniper)** | 预测公布值与预期值的关系 | 鸽派/中性/鹰派，Pari-mutuel 动态赔率 |
| B | **波动猎人 (Volatility Hunter)** | 只赌波动幅度，不赌方向 | 风平浪静 vs 惊涛骇浪 |
| C | **精准点位 (Jackpot)** | 预测结算时刻的精确价格区间 | 高赔率彩票玩法，100x 潜力 |

**支持事件**：
- CPI (消费者物价指数)
- NFP (非农就业数据)
- GDP (国内生产总值)
- Fed Rate Decision (美联储利率决议)

**事件时间轴**：
- 下注窗口 → 锁定倒计时 → 数据发布 → 结算

#### 1.2 宏观数据影响统计 (Macro Stats)
展示主要宏观指标历史影响统计：
- **CPI / NFP / GDP / Fed Rate** 四大核心指标
- 按 **Above (高于预期) / In Line (符合) / Below (低于预期)** 分类
- 统计各资产类别反应：
  - Crypto (加密货币)
  - Stocks (股票)
  - Commodities (商品)
  - Forex (外汇)
- 显示：平均涨跌幅、上涨/下跌次数、样本量

#### 1.3 近期焦点数据 (Focus Data)
展示近 3 个月发布的重要宏观数据：
- GDP 季度数据
- 核心 CPI
- 非农就业
- 零售销售
- ISM 制造业 PMI

---

### 2. 市场页面 (Markets)

#### 2.1 资产分类浏览
按类别筛选市场：
- **All** - 全部市场
- **Crypto** - 加密货币 (BTC, ETH, SOL, XRP, DOGE, ADA)
- **US Stocks** - 美股 (NVDA, TSLA, AAPL, GOOGL, MSFT, AMZN, META)
- **Indices** - 指数 (SPX500, US30, NAS100)
- **HK Stocks** - 港股 (0700.HK, 9988.HK, 1810.HK)
- **Commodities** - 商品 (XAUUSD, XAGUSD)
- **Forex** - 外汇 (EURUSD, USDJPY, GBPUSD, AUDUSD)

#### 2.2 市场卡片信息
每个市场卡片显示：
- 资产符号与名称
- 涨/跌赔率 (动态)
- LIVE 状态标识
- 交易量

#### 2.3 资产详情弹窗
点击市场卡片展开详细下注面板，支持涨跌幅区间投注。

---

### 3. 宏观数据仪表盘 (Macro Dashboard)

全量宏观经济指标可视化，分为九大类别：

| 类别 | 英文名 | 指标示例 |
|------|--------|----------|
| 独立可观测指标 | Independent Indicators | VIX、MOVE 指数 |
| 美国经济晴雨表 | US Economic Barometer | GDP、失业率、CPI、核心 PCE |
| 美元流动性指标 | USD Liquidity | 美联储资产负债表、RRP、TGA |
| 美国利率市场 | US Interest Rate | SOFR、IORB、SRF |
| 预期/情绪影响 | Expectations & Sentiment | 通胀预期、消费者信心、FOMC 鹰鸽 |
| 全球经济与金融 | Global Economy | 欧央行、日央行利率决议 |
| 期货市场数据 | Futures Market | BTC 期货持仓、资金费率 |
| ETF 数据 | ETF Data | BTC/ETH ETF 净流入 |

每个指标卡片显示：
- 指标名称 (中英文)
- 当前值与单位
- 变化幅度与方向
- 发布日期

---

### 4. 投资组合 (Portfolio)

用户个人持仓管理页面：

#### 4.1 概览卡片
- **投资组合价值** - 总资产净值
- **现金余额** - 可用余额
- **盈亏统计** - 支持 1D/1W/1M/ALL 时间筛选

#### 4.2 持仓管理
- **Positions** - 当前持仓
- **Open Orders** - 未结订单
- **History** - 历史记录

#### 4.3 持仓详情表
| 字段 | 说明 |
|------|------|
| MARKET | 市场/资产 |
| AVG → NOW | 均价 → 现价 |
| BET | 下注金额 |
| TO WIN | 潜在收益 |
| VALUE | 当前价值 |

---

## 👤 用户系统

### 认证方式
- **Twitter/X OAuth 登录** - 一键登录，无需注册
- 用户头像与用户名展示
- 登出功能

### 用户界面
- 顶部导航栏显示登录状态
- 已登录：显示头像 + @username + 登出按钮
- 未登录：显示 "Login with X" 按钮

---

## 🌐 国际化支持

### 语言切换
- **English (EN)** - 英文
- **中文 (ZH)** - 简体中文

### 覆盖范围
- 导航菜单
- 所有功能模块标签
- 投注面板文案
- 状态提示信息
- 页脚声明

---

## 📊 支持资产列表

### 加密货币 (Crypto)
| 符号 | 名称 |
|------|------|
| BTC | Bitcoin |
| ETH | Ethereum |
| SOL | Solana |
| XRP | Ripple |
| DOGE | Dogecoin |
| ADA | Cardano |

### 美股 (US Stocks)
| 符号 | 名称 |
|------|------|
| NVDA | NVIDIA |
| TSLA | Tesla |
| AAPL | Apple |
| GOOGL | Google |
| MSFT | Microsoft |
| AMZN | Amazon |
| META | Meta |

### 指数 (Indices)
| 符号 | 名称 |
|------|------|
| SPX500 | S&P 500 |
| US30 | Dow Jones |
| NAS100 | Nasdaq 100 |
| RUSS2000 | Russell 2000 |
| CHINA50 | China A50 |
| HK50 | Hang Seng |
| JPN225 | Nikkei 225 |
| VIX | Volatility Index |
| USDX | US Dollar Index |

### 港股 (HK Stocks)
| 符号 | 名称 |
|------|------|
| 0700.HK | Tencent |
| 9988.HK | Alibaba |
| 1810.HK | Xiaomi |

### 商品 (Commodities)
| 符号 | 名称 |
|------|------|
| XAUUSD | Gold |
| XAGUSD | Silver |
| XPTUSD | Platinum |
| XPDUSD | Palladium |
| USOUSD | US Oil |

### 外汇 (Forex)
| 符号 | 名称 |
|------|------|
| USDCNH | USD/CNH |
| EURUSD | EUR/USD |
| USDJPY | USD/JPY |
| AUDUSD | AUD/USD |
| GBPUSD | GBP/USD |

---

## 🏗️ 技术架构

### 前端
- **框架**：React + TypeScript
- **构建工具**：Vite
- **样式**：CSS Modules
- **图标**：Lucide React
- **状态管理**：React Hooks

### 后端
- **框架**：NestJS (TypeScript)
- **数据库**：PostgreSQL
- **ORM**：TypeORM
- **认证**：Twitter OAuth

### 后端模块
| 模块 | 功能 |
|------|------|
| auth | 用户认证 (Twitter OAuth) |
| users | 用户管理 |
| events | 宏观事件管理 |
| bets | 下注逻辑 |
| orders | 订单处理 |
| settlement | 结算系统 |
| statistics | 统计分析 |

### 部署
- **前端**：Vercel
- **后端**：Railway
- **域名**：macro-bet.vercel.app

---

## 📐 页面结构

```
MacroBet
├── 侧边栏导航
│   ├── Dashboard (仪表盘) ✓ 默认
│   ├── Markets (市场)
│   ├── Macro (宏观数据)
│   ├── Portfolio (投资组合)
│   └── Settings (设置)
│
├── 顶部栏
│   ├── 资产选择器
│   ├── 语言切换 (EN/中文)
│   └── 用户登录状态
│
└── 主内容区
    ├── Dashboard
    │   ├── Shockwave 下注面板 (CPI/NFP/GDP/Fed)
    │   ├── Macro Stats 历史统计
    │   └── Focus Data 焦点数据
    │
    ├── Markets
    │   ├── 分类标签栏
    │   ├── 市场卡片网格
    │   └── 详情下注弹窗
    │
    ├── Macro
    │   └── 9 大类别宏观指标面板
    │
    └── Portfolio
        ├── 资产概览卡片
        └── 持仓/订单/历史表格
```

---

## 🎨 设计规范

### 主题
- **暗黑模式** 为主
- 渐变色调：紫色 → 蓝色 → 青色
- 玻璃拟态 (Glassmorphism) 卡片效果

### 色彩
| 用途 | 色值 |
|------|------|
| 上涨/利好 | `#10b981` (绿色) |
| 下跌/利空 | `#ef4444` (红色) |
| 主色调 | `#8b5cf6` (紫色) |
| 强调色 | `#3b82f6` (蓝色) |
| 背景 | `#0a0a0f` (深黑) |

### 动效
- 页面切换渐入动画
- 卡片 hover 效果
- 倒计时实时更新
- Loading 状态动画

---

## 📝 版本信息

- **当前版本**：MVP 1.0
- **最后更新**：2026-01-07
- **版权所有**：© 2025 MacroBet Inc.

---

## 🚀 未来规划

### Phase 2
- [ ] 真实市场数据接入
- [ ] 钱包接入与充值
- [ ] 实时结算系统
- [ ] 排行榜与社交功能

### Phase 3
- [ ] 移动端 App
- [ ] 更多宏观事件类型
- [ ] AI 预测辅助
- [ ] 社区与跟单功能
