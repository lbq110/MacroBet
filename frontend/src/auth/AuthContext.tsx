import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

interface User {
    id: string;
    username: string;
    name: string;
    profileImageUrl: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// X OAuth 2.0 with PKCE
const X_CLIENT_ID = 'c1RoN2dKUXRVRkl3QVZXRS1ERTM6MTpjaQ';
const REDIRECT_URI = typeof window !== 'undefined'
    ? (window.location.hostname === 'localhost'
        ? 'http://localhost:5173/auth/twitter/callback'
        : 'https://macro-bet.vercel.app/auth/twitter/callback')
    : 'http://localhost:5173/auth/twitter/callback';

// Generate PKCE code verifier and challenge
function generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

async function generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('macrobet_user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch {
                localStorage.removeItem('macrobet_user');
            }
        }
        setIsLoading(false);
    }, []);

    // Handle OAuth callback - with flag to prevent double execution in React Strict Mode
    useEffect(() => {
        let isProcessing = false;

        const handleCallback = async () => {
            if (isProcessing) return;

            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const state = urlParams.get('state');
            const savedState = sessionStorage.getItem('oauth_state');
            const codeVerifier = sessionStorage.getItem('code_verifier');

            if (code && state && state === savedState && codeVerifier) {
                isProcessing = true;

                // Immediately clear session storage to prevent double execution
                sessionStorage.removeItem('oauth_state');
                sessionStorage.removeItem('code_verifier');

                // Clean URL immediately
                window.history.replaceState({}, '', window.location.pathname);

                try {
                    // Call backend to exchange code for tokens and get user profile
                    const apiUrl = window.location.hostname === 'localhost'
                        ? 'http://localhost:3000/auth/twitter/callback'
                        : 'https://macrobet-production.up.railway.app/auth/twitter/callback';

                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            code,
                            redirectUri: REDIRECT_URI,
                            codeVerifier,
                        }),
                    });

                    if (response.ok) {
                        const userData: User = await response.json();
                        setUser(userData);
                        localStorage.setItem('macrobet_user', JSON.stringify(userData));
                    } else {
                        console.error('Auth failed:', await response.text());
                    }
                } catch (error) {
                    console.error('Auth error:', error);
                }
            }
        };

        handleCallback();
    }, []);

    const login = useCallback(async () => {
        const state = generateCodeVerifier();
        const codeVerifier = generateCodeVerifier();
        const codeChallenge = await generateCodeChallenge(codeVerifier);

        sessionStorage.setItem('oauth_state', state);
        sessionStorage.setItem('code_verifier', codeVerifier);

        const params = new URLSearchParams({
            response_type: 'code',
            client_id: X_CLIENT_ID,
            redirect_uri: REDIRECT_URI,
            scope: 'tweet.read users.read offline.access',
            state: state,
            code_challenge: codeChallenge,
            code_challenge_method: 'S256',
        });

        window.location.href = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('macrobet_user');
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
