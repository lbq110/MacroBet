import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { I18nProvider } from './i18n'
import { AuthProvider } from './auth/AuthContext'
import { BetsProvider } from './context/BetsContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BetsProvider>
        <I18nProvider>
          <App />
        </I18nProvider>
      </BetsProvider>
    </AuthProvider>
  </StrictMode>,
)
