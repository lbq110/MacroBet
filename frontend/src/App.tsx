import { useState } from 'react';
import { MOCK_ASSETS, MOCK_MACRO_DATA, MOCK_BETS, MOCK_SHOCKWAVE_EVENT } from './data/mockData';
import { useI18n } from './i18n';

import { AssetHero } from './components/AssetHero/AssetHero';
import { MacroImpact } from './components/MacroImpact/MacroImpact';
import { BettingPanel } from './components/BettingPanel/BettingPanel';
import { ShockwavePanel } from './components/ShockwavePanel/ShockwavePanel';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { Calendar } from './pages/Calendar/Calendar';
import {
  BarChart3,
  Calendar as CalendarIcon,
  LayoutDashboard,
  Settings,
  TrendingUp,
  Wallet
} from 'lucide-react';
import './App.css';

function App() {
  const [view, setView] = useState<'detail' | 'calendar'>('detail');
  const [activeAssetId, setActiveAssetId] = useState<string>(MOCK_ASSETS[0].id);
  const { t } = useI18n();

  const activeAsset = MOCK_ASSETS.find(a => a.id === activeAssetId) || MOCK_ASSETS[0];

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
          <button className="nav-btn">
            <TrendingUp size={20} />
            <span>{t.nav.markets}</span>
          </button>
          <button className="nav-btn">
            <Wallet size={20} />
            <span>{t.nav.portfolio}</span>
          </button>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <button className="nav-btn">
            <Settings size={20} />
            <span>Settings</span>
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
              {MOCK_ASSETS.map(asset => (
                <option key={asset.id} value={asset.id}>{asset.name} ({asset.symbol})</option>
              ))}
            </select>
          </div>
          <div className="header-right">
            <LanguageSwitcher />
            <div className="user-profile">
              <div className="avatar">JD</div>
            </div>
          </div>
        </header>

        <main className="main-content">
          {view === 'detail' ? (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
              {activeAsset.id === 'btc' && <ShockwavePanel event={MOCK_SHOCKWAVE_EVENT} />}
              <AssetHero asset={activeAsset} />
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 'var(--space-8)', alignItems: 'start' }}>
                <MacroImpact macroData={MOCK_MACRO_DATA} />
                <BettingPanel bets={MOCK_BETS} />
              </div>
            </div>
          ) : (
            <Calendar />
          )}
        </main>

        <footer className="footer">
          <p>Market data is for demonstration purposes only. &copy; 2025 MacroBet Inc.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;

