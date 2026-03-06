import {
    createContext,
    useContext,
    useState,
    useCallback,
    type ReactNode,
} from 'react';
import { api } from './axios';

// ─── Types ───────────────────────────────────────────────────────────────────

export type AuthUser = {
    id: string;
    name: string;
    email: string;
    pictureUrl: string | null;
};

type AuthState = {
    accessToken: string;
    user: AuthUser;
};

type AuthContextValue = {
    user: AuthUser | null;
    isAuthenticated: boolean;
    loginWithGoogle: (idToken: string) => Promise<void>;
    logout: () => void;
};

// ─── Storage helpers ─────────────────────────────────────────────────────────

const STORAGE_KEY = 'hs_auth';

function loadFromStorage(): AuthState | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as AuthState) : null;
    } catch {
        return null;
    }
}

function saveToStorage(state: AuthState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function clearStorage() {
    localStorage.removeItem(STORAGE_KEY);
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [auth, setAuth] = useState<AuthState | null>(loadFromStorage);

    const loginWithGoogle = useCallback(async (idToken: string) => {
        const { data } = await api.post<{ accessToken: string; user: AuthUser }>(
            '/api/auth/google',
            { idToken },
        );
        const state: AuthState = { accessToken: data.accessToken, user: data.user };
        saveToStorage(state);
        setAuth(state);
    }, []);

    const logout = useCallback(() => {
        clearStorage();
        setAuth(null);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user:            auth?.user ?? null,
                isAuthenticated: auth !== null,
                loginWithGoogle,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}
