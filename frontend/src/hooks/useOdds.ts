import { useState, useEffect, useCallback } from 'react';

export interface OddsData {
    dataSniper: Record<string, number>;
    volatilityHunter: Record<string, number>;
    jackpot: Record<string, number>;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Hook to fetch and refresh Pari-mutuel odds every 3 seconds
 */
export function useOdds(eventId: string, refreshInterval = 3000) {
    const [odds, setOdds] = useState<OddsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOdds = useCallback(async () => {
        if (!eventId) return;

        try {
            const response = await fetch(`${API_BASE_URL}/events/${eventId}/odds`);
            if (!response.ok) {
                throw new Error('Failed to fetch odds');
            }
            const data = await response.json();
            setOdds(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, [eventId]);

    useEffect(() => {
        // Initial fetch
        fetchOdds();

        // Set up polling interval (3 seconds)
        const intervalId = setInterval(fetchOdds, refreshInterval);

        return () => clearInterval(intervalId);
    }, [fetchOdds, refreshInterval]);

    return { odds, loading, error, refetch: fetchOdds };
}

/**
 * Calculate pool share percentage for display
 */
export function calculatePoolShare(
    optionExposure: number,
    totalModeExposure: number
): string {
    if (totalModeExposure === 0) return '0%';
    const share = (optionExposure / totalModeExposure) * 100;
    return `${share.toFixed(1)}%`;
}
