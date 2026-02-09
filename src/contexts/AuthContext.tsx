import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useNavigate } from "@tanstack/react-router";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: "admin" | "analyst" | "viewer";
  is_active: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (...roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "sentinel-access-token";
const REFRESH_KEY = "sentinel-refresh-token";

// Auth endpoints are served by core-banking (token issuer)
const AUTH_BASE_URL =
  typeof window !== "undefined"
    ? (import.meta.env.VITE_AUTH_URL as string) || "http://localhost:8001"
    : "http://banking-inbound-http:8001";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearAuth = useCallback(() => {
    setUser(null);
    setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_KEY);
    }
  }, []);

  const fetchMe = useCallback(
    async (accessToken: string): Promise<AuthUser | null> => {
      try {
        const res = await fetch(`${AUTH_BASE_URL}/api/v1/auth/admin/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) return null;
        return (await res.json()) as AuthUser;
      } catch {
        return null;
      }
    },
    [],
  );

  // Rehydrate session on mount
  useEffect(() => {
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }
    const saved = localStorage.getItem(TOKEN_KEY);
    if (!saved) {
      setIsLoading(false);
      return;
    }
    fetchMe(saved).then((me) => {
      if (me) {
        setToken(saved);
        setUser(me);
      } else {
        clearAuth();
      }
      setIsLoading(false);
    });
  }, [fetchMe, clearAuth]);

  const login = useCallback(
    async (username: string, password: string) => {
      const body = new URLSearchParams({ username, password });
      const res = await fetch(`${AUTH_BASE_URL}/api/v1/auth/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.detail ?? "Login failed");
      }

      const data = await res.json();
      const accessToken: string = data.access_token;
      const refreshToken: string = data.refresh_token;

      localStorage.setItem(TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_KEY, refreshToken);
      setToken(accessToken);

      const me = await fetchMe(accessToken);
      if (!me) throw new Error("Failed to fetch user profile");
      setUser(me);
    },
    [fetchMe],
  );

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  const hasRole = useCallback(
    (...roles: string[]) => {
      if (!user) return false;
      return roles.includes(user.role);
    },
    [user],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
