import { useState } from 'react';
import { MOCK_ASSETS, ALL_SHOCKWAVE_EVENTS } from './data/mockData';
import { useI18n } from './i18n';
import { useAuth } from './auth/AuthContext';

import { ShockwavePanel } from './components/ShockwavePanel/ShockwavePanel';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { Calendar } from './pages/Calendar/Calendar';
import { Portfolio } from './pages/Portfolio/Portfolio';
import { Markets } from './pages/Markets/Markets';
import { MacroStats } from './components/MacroStats/MacroStats';
import { FocusData } from './components/FocusData/FocusData';
import { MacroDashboard } from './pages/MacroDashboard/MacroDashboard';
import {
  BarChart3,
  Calendar as CalendarIcon,
  LayoutDashboard,
  Settings,
  TrendingUp,
  Wallet,
  LogIn,
  LogOut
} from 'lucide-react';
import './App.css';

type ViewType = 'detail' | 'calendar' | 'portfolio' | 'markets' | 'macro';

function App() {
  const [view, setView] = useState<ViewType>('detail');
  const [activeAssetId, setActiveAssetId] = useState<string>(MOCK_ASSETS[0].id);
  const { t } = useI18n();
  const { user, login, logout, isLoading } = useAuth();

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-logo">{t.app.title}</div>
        <nav className="nav-links">
          <button
            className={`nav-btn ${view === 'detail' ? 'active' : ''}`}
            onClick={() => setView('detail')}
          >
            <LayoutDashboard size={20} />
            <span>{t.nav.dashboard}</span>
          </button>
          <button
            className={`nav-btn ${view === 'calendar' ? 'active' : ''}`}
            onClick={() => setView('calendar')}
          >
            <CalendarIcon size={20} />
            <span>{t.nav.calendar}</span>
          </button>
          <button
            className={`nav-btn ${view === 'markets' ? 'active' : ''}`}
            onClick={() => setView('markets')}
          >
            <TrendingUp size={20} />
            <span>{t.nav.markets}</span>
          </button>
          <button
            className={`nav-btn ${view === 'macro' ? 'active' : ''}`}
            onClick={() => setView('macro')}
          >
            <BarChart3 size={20} />
            <span>Macro</span>
          </button>
          <button
            className={`nav-btn ${view === 'portfolio' ? 'active' : ''}`}
            onClick={() => setView('portfolio')}
          >
            <Wallet size={20} />
            <span>{t.nav.portfolio}</span>
          </button>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <button className="nav-btn">
            <Settings size={20} />
            <span>{t.nav.settings}</span>
          </button>
        </div>
      </aside>

      <div className="main-wrapper">
        <header className="top-bar">
          <div className="asset-selector">
            <BarChart3 size={20} className="text-secondary" />
            <select
              value={activeAssetId}
              onChange={(e) => setActiveAssetId(e.target.value)}
              className="asset-dropdown"
            >
              <optgroup label="Crypto">
                {MOCK_ASSETS.filter(a => a.category === 'Crypto').map(asset => (
                  <option key={asset.id} value={asset.id}>{asset.name} ({asset.symbol})</option>
                ))}
              </optgroup>
              <optgroup label="US Stocks">
                {MOCK_ASSETS.filter(a => a.category === 'US Stocks').map(asset => (
                  <option key={asset.id} value={asset.id}>{asset.name} ({asset.symbol})</option>
                ))}
              </optgroup>
              <optgroup label="Indices">
                {MOCK_ASSETS.filter(a => a.category === 'Indices').map(asset => (
                  <option key={asset.id} value={asset.id}>{asset.name} ({asset.symbol})</option>
                ))}
              </optgroup>
              <optgroup label="HK Stocks">
                {MOCK_ASSETS.filter(a => a.category === 'HK Stocks').map(asset => (
                  <option key={asset.id} value={asset.id}>{asset.name} ({asset.symbol})</option>
                ))}
              </optgroup>
              <optgroup label="Commodities">
                {MOCK_ASSETS.filter(a => a.category === 'Commodities').map(asset => (
                  <option key={asset.id} value={asset.id}>{asset.name} ({asset.symbol})</option>
                ))}
              </optgroup>
              <optgroup label="Forex">
                {MOCK_ASSETS.filter(a => a.category === 'Forex').map(asset => (
                  <option key={asset.id} value={asset.id}>{asset.name} ({asset.symbol})</option>
                ))}
              </optgroup>
            </select>
          </div>
          <div className="header-right">
            <LanguageSwitcher />
            {isLoading ? (
              <div className="user-profile">
                <div className="avatar loading">...</div>
              </div>
            ) : user ? (
              <div className="user-profile-logged">
                <img src={user.profileImageUrl} alt={user.name} className="avatar-img" />
                <span className="username">@{user.username}</span>
                <button className="logout-btn" onClick={logout} title="Logout">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button className="login-x-btn" onClick={login}>
                <LogIn size={16} />
                <span>Login with X</span>
              </button>
            )}
          </div>
        </header>

        <main className="main-content">
          {view === 'detail' ? (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
              {/* 1. Shockwave Betting Panels - CPI, NFP, GDP, Fed Rate */}
              <div className="shockwave-events-grid" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                {ALL_SHOCKWAVE_EVENTS.filter(e => e.id !== 'boj-sw-001').map(event => (
                  <ShockwavePanel key={event.id} event={event} />
                ))}
              </div>

              {/* 2. Macro Data Impact - 30 Year Historical Statistics */}
              <MacroStats />

              {/* 3. Recent Focus Data */}
              <FocusData />
            </div>
          ) : view === 'calendar' ? (
            <Calendar />
          ) : view === 'markets' ? (
            <Markets />
          ) : view === 'macro' ? (
            <MacroDashboard />
          ) : (
            <Portfolio />
          )}
        </main>

        <footer className="footer">
          <p>{t.footer.disclaimer} {t.footer.copyright}</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
