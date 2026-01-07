<p align="center">
  <img src="https://img.shields.io/badge/MacroBet-Prediction%20Market-8b5cf6?style=for-the-badge" alt="MacroBet" />
</p>

<h1 align="center">🎯 MacroBet</h1>

<p align="center">
  <strong>Data-Driven Macro Event Prediction Platform</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#demo">Demo</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Project Structure</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.x-61dafb?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/NestJS-10.x-e0234e?logo=nestjs" alt="NestJS" />
  <img src="https://img.shields.io/badge/PostgreSQL-15-4169e1?logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Vite-5.x-646cff?logo=vite" alt="Vite" />
</p>

---

## 📖 Overview

**MacroBet** is an innovative prediction platform that leverages **30 years of historical data** to analyze how asset prices react to macroeconomic events like CPI, Non-Farm Payrolls, GDP, and Fed Rate Decisions.

> 💡 Make smarter predictions by understanding how markets historically respond to economic data releases.

---

## ✨ Features

### 🎯 Shockwave Betting System

Experience high-stakes predictions during major economic data releases with three unique betting modes:

| Mode | Name | Description |
|------|------|-------------|
| 🎯 | **Data Sniper** | Predict if data will be Dovish/Neutral/Hawkish vs expectations |
| 🌊 | **Volatility Hunter** | Bet on price movement magnitude (Calm vs Tsunami) |
| 🎰 | **Jackpot** | Predict exact price ranges with up to 100x potential |

**Supported Events:**
- 📊 CPI (Consumer Price Index)
- 💼 NFP (Non-Farm Payrolls)
- 📈 GDP (Gross Domestic Product)
- 🏦 Fed Rate Decision

### 📊 Macro Statistics Dashboard

- 30-year historical analysis of market reactions
- Breakdown by **Above/In Line/Below** expectations
- Multi-asset class coverage (Crypto, Stocks, Commodities, Forex)
- Visual statistics with up/down counts and average changes

### 📈 Markets

Browse and trade across 30+ assets:

| Category | Assets |
|----------|--------|
| 🪙 Crypto | BTC, ETH, SOL, XRP, DOGE, ADA |
| 📊 US Stocks | NVDA, TSLA, AAPL, GOOGL, MSFT, AMZN, META |
| 📉 Indices | SPX500, US30, NAS100, VIX, USDX |
| 🇭🇰 HK Stocks | Tencent, Alibaba, Xiaomi |
| 🥇 Commodities | Gold, Silver, Platinum, Oil |
| 💱 Forex | EUR/USD, USD/JPY, GBP/USD |

### 🌐 Macro Observatory

Real-time tracking of 9 major macro indicator categories:

- 📍 Independent Indicators (VIX, MOVE)
- 🇺🇸 US Economic Barometer (GDP, CPI, Unemployment)
- 💧 USD Liquidity Indicators (Fed Balance Sheet, RRP, TGA)
- 📈 US Interest Rate Market (SOFR, IORB)
- 🧠 Expectations & Sentiment
- 🌍 Global Economy & Finance
- 📊 Futures Market Data
- 💰 ETF Data

### 💼 Portfolio Management

- Track your positions and P&L
- View open orders and trade history
- Time-based filtering (1D, 1W, 1M, ALL)

### 🌍 Internationalization

Full support for:
- 🇺🇸 English
- 🇨🇳 简体中文

---

## 🚀 Demo

**Live Demo:** [macro-bet.vercel.app](https://macro-bet.vercel.app)

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** CSS Modules
- **Icons:** Lucide React
- **State:** React Hooks + Context

### Backend
- **Framework:** NestJS
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Auth:** Twitter/X OAuth

### Deployment
- **Frontend:** Vercel
- **Backend:** Railway

---

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL (for backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lbq110/MacroBet.git
   cd MacroBet
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Configure environment variables**
   ```bash
   # Backend (.env)
   cp .env.example .env
   # Edit .env with your database and OAuth credentials
   ```

5. **Run development servers**

   Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

   Backend:
   ```bash
   cd backend
   npm run start:dev
   ```

6. **Open in browser**
   ```
   http://localhost:5173
   ```

---

## 📁 Project Structure

```
MacroBet/
├── frontend/                    # React frontend
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── ShockwavePanel/  # Shockwave betting panel
│   │   │   ├── MacroStats/      # Historical statistics
│   │   │   ├── FocusData/       # Recent focus data
│   │   │   └── ...
│   │   ├── pages/               # Page components
│   │   │   ├── Markets/         # Markets page
│   │   │   ├── Portfolio/       # Portfolio page
│   │   │   └── MacroDashboard/  # Macro dashboard
│   │   ├── i18n/                # Internationalization
│   │   ├── auth/                # Authentication context
│   │   ├── data/                # Mock data
│   │   └── types/               # TypeScript types
│   └── package.json
│
├── backend/                     # NestJS backend
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/            # Authentication
│   │   │   ├── users/           # User management
│   │   │   ├── events/          # Macro events
│   │   │   ├── bets/            # Betting logic
│   │   │   ├── orders/          # Order processing
│   │   │   ├── settlement/      # Settlement system
│   │   │   └── statistics/      # Statistics
│   │   └── main.ts
│   └── package.json
│
├── PRD.md                       # Product Requirements Document
└── README.md                    # This file
```

---

## 🎨 Design

- **Theme:** Dark mode with gradient accents
- **Colors:** Purple (#8b5cf6), Blue (#3b82f6), Cyan (#06b6d4)
- **Effects:** Glassmorphism, smooth animations
- **Typography:** Modern, clean fonts

---

## 📝 License

This project is proprietary software. All rights reserved.

© 2025 MacroBet Inc.

---

## 🤝 Contributing

This is a private project. For inquiries, please contact the repository owner.

---

<p align="center">
  <strong>Built with ❤️ for traders who understand macro</strong>
</p>
