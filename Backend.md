
# Backend.md

## 技术栈
Node.js + NestJS
PostgreSQL

## 核心模块
- Asset Service
- Macro Event Service
- Odds Engine
- Betting Service
- Settlement Service

## 结算逻辑
- T0：数据发布时间
- **结算窗口**：T+30m (短线) 或 T+24h (长线)
- 按涨跌幅区间判定输赢
- 数据来源于交易所 VWAP 或收盘价

## Shockwave 结算逻辑细化 (核心)

### 1. 状态机切换 (Lifecycle)
| 状态 | 时间 (以 CPI 8:30 为例) | 动作 |
| :--- | :--- | :--- |
| **Betting** | 08:00:00 - 08:14:59 | 允许下注、允许撤单 |
| **Locked** | 08:15:00 - 08:29:59 | 允许下注、**禁止撤单** |
| **Live** | 08:30:00 - 08:34:59 | **停止下注**；等待 CPI 公布与波动完成 |
| **Settling** | 08:35:00 - 08:35:30 | 触发计算：获取价格、获取 CPI、判定结果 |
| **Closed** | 08:35:30+ | 发放奖金；生成报告 |

### 2. 数据源与定价 (Oracle)
- **CPI 预期值 (Forecast)**：在 Betting 阶段锁定，前端实时显示。来源：Investing.com / Bloomberg。
- **CPI 实际值 (Actual)**：8:30:01 启动轮询，获取第一个有效公布值。
- **开奖基准价 (Base Price)**：取 08:30:00 时刻前后的 **10秒 TWAP** (08:29:55 - 08:30:05)，防止瞬时插针噪音。
- **开奖结算价 (Settle Price)**：取 08:35:00 时刻前后的 **10秒 TWAP** (08:34:55 - 08:35:05)。

### 3. 三重博弈结算算法
#### A. Data Sniper (数据狙击手)
- 输赢判定：
  - `Actual < Forecast - ErrorMargin` -> Dovish 胜
  - `Actual > Forecast + ErrorMargin` -> Hawkish 胜
  - `Other` -> Neutral 胜
- 赔率：`Odds = (PoolTotal * 0.95) / PoolOption` (5% 抽水)

#### B. Volatility Hunter (波动猎人)
- 变动值：`Delta = |SettlePrice - BasePrice|`
- 判定：
  - `Delta > $1000` (暂定) -> 惊涛骇浪胜
  - `Delta < $200` (暂定) -> 风平浪静胜
  - `Other` -> 庄家/中间档位

#### C. Jackpot (精准点位)
- 判定：`SettlePrice \in Range[i]`
- 赔率：根据下注时刻的赔率固定，或动态 Pari-mutuel。

### 4. 关键技术挑战
- **并发处理**：8:29:59 秒的爆发性买单处理。
- **Idempotency (幂等性)**：结算任务只能成功执行一次，防止双重派奖。
- **Failover**：如果数据源延迟（如 CPI 推迟公布），系统需能自动拉长 Live 状态。

