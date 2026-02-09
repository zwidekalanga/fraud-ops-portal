import axios, { type AxiosInstance } from "axios";

// Types
export interface FraudRule {
  code: string;
  name: string;
  description: string | null;
  category: string;
  severity: string;
  score: number;
  enabled: boolean;
  conditions: Record<string, unknown>;
  effective_from: string | null;
  effective_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface TriggeredRule {
  code: string;
  name: string;
  category: string;
  severity: string;
  score: number;
  description: string | null;
}

export interface AlertTransaction {
  external_id: string;
  amount: number;
  currency: string;
  transaction_type: string;
  channel: string;
  merchant_name: string | null;
  location_country: string | null;
  transaction_time: string;
}

export type DecisionTier = "APPROVE" | "REVIEW" | "FLAG";

export interface FraudAlert {
  id: string;
  transaction_id: string;
  customer_id: string;
  risk_score: number;
  decision: "approve" | "review" | "flag";
  decision_tier: DecisionTier | null;
  decision_tier_description: string | null;
  status: "pending" | "confirmed" | "dismissed" | "escalated";
  triggered_rules: TriggeredRule[];
  processing_time_ms: number | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
  created_at: string;
  updated_at: string;
  transaction: AlertTransaction | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface AlertFilters {
  status?: string;
  customer_id?: string;
  min_score?: number;
  max_score?: number;
  decision?: string;
  from_date?: string;
  to_date?: string;
  page?: number;
  size?: number;
}

export interface AlertReview {
  status: "confirmed" | "dismissed" | "escalated";
  notes?: string;
}

export interface AlertStats {
  total: number;
  by_status: Record<string, number>;
  average_score: number;
}

export interface DailyVolume {
  date: string;
  alerts: number;
}

export interface HealthStatus {
  status: string;
  service: string;
  version: string;
}

export interface SystemConfig {
  auto_escalation_threshold: number;
  data_retention_days: number;
}

export interface CustomerSummary {
  customer_id: string;
  full_name: string;
  tier: string;
  kyc_status: string;
  account_age_days: number;
  total_accounts: number;
  total_transactions_30d: number;
  total_spend_30d: string;
  avg_transaction_amount: string;
  risk_rating: string;
}

// API Clients — fraud-detection for domain APIs, core-banking for auth
const API_BASE_URL =
  typeof window !== "undefined"
    ? (import.meta.env.VITE_API_URL as string) || "http://localhost:8000"
    : "http://fraud-api:8000";

const AUTH_BASE_URL =
  typeof window !== "undefined"
    ? (import.meta.env.VITE_AUTH_URL as string) || "http://localhost:8001"
    : "http://banking-inbound-http:8001";

const TOKEN_KEY = "sentinel-access-token";
const REFRESH_KEY = "sentinel-refresh-token";

const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

const authClient: AxiosInstance = axios.create({
  baseURL: `${AUTH_BASE_URL}/api/v1/auth/admin`,
  headers: {
    "Content-Type": "application/json",
  },
});

const bankingClient: AxiosInstance = axios.create({
  baseURL: `${AUTH_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Bearer token to every request
const attachToken = (config: import("axios").InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
};
apiClient.interceptors.request.use(attachToken);
authClient.interceptors.request.use(attachToken);
bankingClient.interceptors.request.use(attachToken);

// On 401, attempt silent refresh; if that fails, redirect to login
let refreshPromise: Promise<string | null> | null = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (
      error.response?.status === 401 &&
      !original._retry &&
      typeof window !== "undefined"
    ) {
      original._retry = true;
      const refreshToken = localStorage.getItem(REFRESH_KEY);
      if (!refreshToken) {
        localStorage.removeItem(TOKEN_KEY);
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // Deduplicate concurrent refresh attempts
      if (!refreshPromise) {
        refreshPromise = authClient
          .post("/refresh", { refresh_token: refreshToken })
          .then((res) => {
            const newAccess: string = res.data.access_token;
            const newRefresh: string = res.data.refresh_token;
            localStorage.setItem(TOKEN_KEY, newAccess);
            localStorage.setItem(REFRESH_KEY, newRefresh);
            return newAccess;
          })
          .catch(() => {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(REFRESH_KEY);
            window.location.href = "/login";
            return null;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newToken = await refreshPromise;
      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(original);
      }
    }
    return Promise.reject(error);
  },
);

// Auth types
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: "admin" | "analyst" | "viewer";
  is_active: boolean;
}

// API Functions
export const api = {
  // Auth (via core-banking)
  login: async (username: string, password: string): Promise<TokenResponse> => {
    const body = new URLSearchParams({ username, password });
    const response = await authClient.post<TokenResponse>("/login", body, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
    const response = await authClient.post<TokenResponse>("/refresh", {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  getMe: async (): Promise<AuthUser> => {
    const response = await authClient.get<AuthUser>("/me");
    return response.data;
  },

  // Rules
  getRules: async (params?: {
    enabled?: boolean;
    category?: string;
    page?: number;
    size?: number;
  }) => {
    const response = await apiClient.get<PaginatedResponse<FraudRule>>(
      "/rules",
      { params },
    );
    return response.data;
  },

  getRule: async (code: string) => {
    const response = await apiClient.get<FraudRule>(`/rules/${code}`);
    return response.data;
  },

  createRule: async (rule: Omit<FraudRule, "created_at" | "updated_at">) => {
    const response = await apiClient.post<FraudRule>("/rules", rule);
    return response.data;
  },

  updateRule: async (code: string, rule: Partial<FraudRule>) => {
    const response = await apiClient.put<FraudRule>(`/rules/${code}`, rule);
    return response.data;
  },

  toggleRule: async (code: string) => {
    const response = await apiClient.post<FraudRule>(`/rules/${code}/toggle`);
    return response.data;
  },

  deleteRule: async (code: string) => {
    await apiClient.delete(`/rules/${code}`);
  },

  // Alerts
  getAlerts: async (filters?: AlertFilters) => {
    const response = await apiClient.get<PaginatedResponse<FraudAlert>>(
      "/alerts",
      { params: filters },
    );
    return response.data;
  },

  getAlert: async (id: string) => {
    const response = await apiClient.get<FraudAlert>(`/alerts/${id}`);
    return response.data;
  },

  reviewAlert: async (id: string, review: AlertReview) => {
    const response = await apiClient.post(`/alerts/${id}/review`, review);
    return response.data;
  },

  getAlertStats: async () => {
    const response = await apiClient.get<AlertStats>("/alerts/stats/summary");
    return response.data;
  },

  getDailyVolume: async (days = 7): Promise<DailyVolume[]> => {
    const response = await apiClient.get<DailyVolume[]>(
      "/alerts/stats/daily-volume",
      { params: { days } },
    );
    return response.data;
  },

  // Health (root-level endpoint, not under /api/v1)
  getHealth: async () => {
    const response = await axios.get<HealthStatus>(`${API_BASE_URL}/health`);
    return response.data;
  },

  // Config
  getConfig: async (): Promise<SystemConfig> => {
    const response = await apiClient.get<SystemConfig>("/config");
    return response.data;
  },

  updateConfig: async (
    config: Partial<SystemConfig>,
  ): Promise<SystemConfig> => {
    const response = await apiClient.put<SystemConfig>("/config", config);
    return response.data;
  },

  // Customer (via core-banking)
  getCustomerSummary: async (customerId: string): Promise<CustomerSummary> => {
    const response = await bankingClient.get<CustomerSummary>(
      `/customers/${customerId}/summary`,
    );
    return response.data;
  },
};

export default api;
