import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Bet order types
export interface BetOrder {
    id: string;
    eventId: string;
    eventName: string;
    mode: 'sniper' | 'vol' | 'jackpot';
    modeLabel: string;
    optionId: string;
    optionLabel: string;
    amount: number;
    odds: number | null;
    potentialWin: number | null;
    status: 'pending' | 'won' | 'lost' | 'refunded';
    createdAt: string;
    settledAt?: string;
    payout?: number;
}

interface BetsContextType {
    orders: BetOrder[];
    addOrder: (order: Omit<BetOrder, 'id' | 'createdAt' | 'status'>) => void;
    settleOrder: (orderId: string, result: 'won' | 'lost' | 'refunded', payout?: number) => void;
    getOpenOrders: () => BetOrder[];
    getHistory: () => BetOrder[];
    getTotalPending: () => number;
    clearAll: () => void;
}

const BetsContext = createContext<BetsContextType | null>(null);

const STORAGE_KEY = 'macrobet_orders';

export const BetsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [orders, setOrders] = useState<BetOrder[]>(() => {
        // Load from localStorage on init
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // Persist to localStorage whenever orders change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    }, [orders]);

    const addOrder = useCallback((orderData: Omit<BetOrder, 'id' | 'createdAt' | 'status'>) => {
        const newOrder: BetOrder = {
            ...orderData,
            id: `bet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
            status: 'pending',
        };
        setOrders(prev => [newOrder, ...prev]);
    }, []);

    const settleOrder = useCallback((orderId: string, result: 'won' | 'lost' | 'refunded', payout?: number) => {
        setOrders(prev => prev.map(order =>
            order.id === orderId
                ? { ...order, status: result, settledAt: new Date().toISOString(), payout }
                : order
        ));
    }, []);

    const getOpenOrders = useCallback(() => {
        return orders.filter(o => o.status === 'pending');
    }, [orders]);

    const getHistory = useCallback(() => {
        return orders.filter(o => o.status !== 'pending');
    }, [orders]);

    const getTotalPending = useCallback(() => {
        return orders
            .filter(o => o.status === 'pending')
            .reduce((sum, o) => sum + o.amount, 0);
    }, [orders]);

    const clearAll = useCallback(() => {
        setOrders([]);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return (
        <BetsContext.Provider value={{
            orders,
            addOrder,
            settleOrder,
            getOpenOrders,
            getHistory,
            getTotalPending,
            clearAll,
        }}>
            {children}
        </BetsContext.Provider>
    );
};

export function useBets() {
    const context = useContext(BetsContext);
    if (!context) {
        throw new Error('useBets must be used within a BetsProvider');
    }
    return context;
}
