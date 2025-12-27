import React, { useState } from 'react';
import { MOCK_MACRO_DATA } from '../../data/mockData';
import { Calendar as CalendarIcon, Filter, ExternalLink, Star } from 'lucide-react';
import './Calendar.css';

export const Calendar: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    const categories = ['All', ...new Set(MOCK_MACRO_DATA.map(item => item.category))];

    const filteredEvents = selectedCategory === 'All'
        ? MOCK_MACRO_DATA
        : MOCK_MACRO_DATA.filter(item => item.category === selectedCategory);

    // Sort by next release (simplified for mock, normally would use actual date objects)
    const sortedEvents = [...filteredEvents].sort((a, b) => {
        if (!a.nextRelease) return 1;
        if (!b.nextRelease) return -1;
        return a.nextRelease.localeCompare(b.nextRelease);
    });

    return (
        <div className="calendar-page">
            <header className="calendar-header">
                <div className="title-area">
                    <CalendarIcon className="header-icon" />
                    <h1>Economic Calendar</h1>
                </div>

                <div className="filter-bar">
                    <Filter size={16} />
                    <div className="category-chips">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`chip ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <div className="events-grid">
                {sortedEvents.map(event => (
                    <div key={event.id} className="event-card">
                        <div className="event-date">
                            <span className="label">Next Release</span>
                            <span className="value">{event.nextRelease || 'TBD'}</span>
                        </div>

                        <div className="event-info">
                            <div className="event-title">
                                <h3>{event.name}</h3>
                                <div className="importance">
                                    {[...Array(event.importance)].map((_, i) => (
                                        <Star key={i} size={12} fill="var(--accent-yellow)" stroke="none" />
                                    ))}
                                </div>
                            </div>
                            <span className="category-tag">{event.category}</span>
                        </div>

                        <div className="event-last">
                            <span className="label">Last Actual</span>
                            <span className="value">Looking for data...</span>
                        </div>

                        <div className="event-actions">
                            <button className="view-stats-btn">
                                <ExternalLink size={14} />
                                View Historical Impact
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
