
# Data PRD – Macro to Price Reaction Engine

## 目标
构建一个**稳定、可复现、可解释**的宏观数据 → 资产价格反应统计引擎，
为前端展示、赔率计算与风控系统提供统一、可信的数据基础。

---

## 一、系统边界与原则

### 做什么
- 对齐宏观数据发布时间与资产价格
- 计算不同宏观结果条件下的历史价格反应
- 输出可直接用于产品与赔率系统的统计指标

### 不做什么
- 不进行因果推断
- 不做价格预测模型
- 不输出投资建议

---

## 二、核心对象定义

### 2.1 MacroEvent（宏观事件）
一次确定时间点的宏观数据发布。

字段：
- indicator_id（如 CPI_US）
- release_time（UTC，精确到秒）
- actual_value
- expected_value
- revision_flag（是否被事后修正）

---

### 2.2 PriceSeries（价格序列）
- 频率：1min Kline / VWAP
- 时区：UTC
- 来源：交易所或聚合器

---

## 三、事件对齐算法（Event Alignment）

### 3.1 事件时间锚点（T0）
- 使用官方发布时间（UTC）
- 若为时间区间（如 08:30），取第一个可交易分钟

---

### 3.2 起始价格 P0
优先级顺序：
1. T0 ~ T0+1min VWAP
2. T0 当分钟 Close
3. T0 前 1 分钟 Close（Fallback）

记录：price_source_type

---

### 3.3 结束价格 P1
- T+5m（Shockwave 专用）
- T+1h
- T+4h
- T+24h（默认）

定义：
- 窗口终点 ±5min VWAP

---

### 3.4 涨跌幅计算
```
return = (P1 - P0) / P0
```

---

## 四、Above / Inline / Below 定量定义

### 4.1 Surprise 定义
```
surprise = actual_value - expected_value
```

---

### 4.2 标准化 Surprise（推荐）
```
normalized_surprise = surprise / std(surprise, rolling_N)
```
- rolling_N：过去 24–36 次发布

---

### 4.3 分类阈值（默认）

| 分类 | 条件 |
|----|----|
| Above | normalized_surprise ≥ +0.5 |
| Inline | -0.5 < normalized_surprise < +0.5 |
| Below | normalized_surprise ≤ -0.5 |

> 阈值可按指标单独配置

---

### 4.4 无历史数据兜底
- 使用固定绝对阈值（如 CPI ±0.1%）
- 标记 classification_confidence = low

---

## 五、统计聚合逻辑

### 5.1 分组维度
- asset_id
- macro_indicator_id
- result_type（Above / Inline / Below）
- window（1h / 4h / 24h）

---

### 5.2 输出指标
- avg_return
- median_return
- win_rate
- sample_size
- std_return（可选）

---

## 六、样本不足处理逻辑（关键）

### 6.1 样本数分级

| 样本数 | 可信度 | 处理方式 |
|------|------|--------|
| ≥20 | 高 | 正常展示 & 用于赔率 |
| 10–19 | 中 | 展示 + 赔率衰减 |
| 5–9 | 低 | 展示，不用于赔率 |
| <5 | 极低 | 不展示统计 |

---

### 6.2 赔率衰减示例
```
effective_p = p × confidence_factor
```
- 高：1.0
- 中：0.7
- 低：0.4

---

### 6.3 前端展示要求
- 明确标注 “Low Sample Size”
- 使用弱化视觉样式

---

## 七、异常与修正处理

### 7.1 数据修正
- 不回滚历史分类
- 标记 revision_flag

### 7.2 极端值处理
- 对 return 进行 Winsorize（1% / 99%）
- 原始数据保留用于审计

---

## 八、最终输出表结构

### PriceReactionStat
- asset_id
- macro_indicator_id
- result_type
- window
- avg_return
- median_return
- win_rate
- sample_size
- confidence_level
- last_updated_at

---

## 九、产品级声明
- 所有统计均为历史结果
- 不代表未来表现
- 不构成投资建议
