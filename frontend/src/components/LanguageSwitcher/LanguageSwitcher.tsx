import React from 'react';
import { useI18n, type Language } from '../../i18n';
import './LanguageSwitcher.css';

export const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage, t } = useI18n();

    const toggleLanguage = () => {
        const newLang: Language = language === 'en' ? 'zh' : 'en';
        setLanguage(newLang);
    };

    return (
        <button className="language-switcher" onClick={toggleLanguage} title="Switch Language">
            <span className={language === 'en' ? 'active' : ''}>{t.language.en}</span>
            <span className="divider">/</span>
            <span className={language === 'zh' ? 'active' : ''}>{t.language.zh}</span>
        </button>
    );
};
