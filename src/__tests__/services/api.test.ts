import { describe, it, expect, vi, beforeEach } from "vitest";

// Use vi.hoisted so these are available when vi.mock (hoisted to top) runs
const { mockApiClient, mockAuthClient, mockCreateFn } = vi.hoisted(() => {
  const createMock = () => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  });

  const apiClient = createMock();
  const authClient = createMock();
  let callCount = 0;

  const createFn = vi.fn((config: { baseURL: string }) => {
    callCount++;
    if (callCount === 1) return apiClient;
    return authClient;
  });

  return {
    mockApiClient: apiClient,
    mockAuthClient: authClient,
    mockCreateFn: createFn,
  };
});

vi.mock("axios", () => ({
  default: {
    create: mockCreateFn,
    get: vi.fn(),
    post: vi.fn(),
  },
}));

import { api } from "../../services/api";

// Capture call data at module load time (before any test resets)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createCalls = mockCreateFn.mock.calls.map((args: any[]) => args[0]);

describe("API Client", () => {
  beforeEach(() => {
    mockApiClient.get.mockReset();
    mockApiClient.post.mockReset();
    mockApiClient.put.mockReset();
    mockApiClient.delete.mockReset();
    mockAuthClient.get.mockReset();
    mockAuthClient.post.mockReset();
    mockAuthClient.put.mockReset();
    mockAuthClient.delete.mockReset();
  });

  it("creates two axios instances (apiClient and authClient)", () => {
    expect(createCalls).toHaveLength(2);
  });

  it("apiClient uses fraud-detection base URL", () => {
    const baseURLs = createCalls.map((c: { baseURL: string }) => c.baseURL);
    expect(baseURLs).toContainEqual(expect.stringContaining("8000/api/v1"));
  });

  it("authClient uses core-banking base URL", () => {
    const baseURLs = createCalls.map((c: { baseURL: string }) => c.baseURL);
    expect(baseURLs).toContainEqual(
      expect.stringContaining("8001/api/v1/auth/admin"),
    );
  });

  describe("domain API methods (via apiClient)", () => {
    it("getRules calls GET /rules with params", async () => {
      mockApiClient.get.mockResolvedValueOnce({
        data: { items: [], total: 0, page: 1, size: 10, pages: 0 },
      });

      const result = await api.getRules({ enabled: true, page: 1 });

      expect(mockApiClient.get).toHaveBeenCalledWith("/rules", {
        params: { enabled: true, page: 1 },
      });
      expect(result.items).toEqual([]);
    });

    it("getAlert calls GET /alerts/:id", async () => {
      mockApiClient.get.mockResolvedValueOnce({
        data: { id: "alert-1", risk_score: 75, status: "pending" },
      });

      const result = await api.getAlert("alert-1");

      expect(mockApiClient.get).toHaveBeenCalledWith("/alerts/alert-1");
      expect(result.id).toBe("alert-1");
    });

    it("reviewAlert calls POST /alerts/:id/review", async () => {
      mockApiClient.post.mockResolvedValueOnce({
        data: { status: "confirmed" },
      });

      await api.reviewAlert("alert-1", {
        status: "confirmed",
        notes: "Verified",
      });

      expect(mockApiClient.post).toHaveBeenCalledWith(
        "/alerts/alert-1/review",
        { status: "confirmed", notes: "Verified" },
      );
    });

    it("toggleRule calls POST /rules/:code/toggle", async () => {
      mockApiClient.post.mockResolvedValueOnce({
        data: { code: "AMT_001", enabled: false },
      });

      await api.toggleRule("AMT_001");

      expect(mockApiClient.post).toHaveBeenCalledWith("/rules/AMT_001/toggle");
    });

    it("deleteRule calls DELETE /rules/:code", async () => {
      mockApiClient.delete.mockResolvedValueOnce({});

      await api.deleteRule("AMT_001");

      expect(mockApiClient.delete).toHaveBeenCalledWith("/rules/AMT_001");
    });

    it("getAlertStats calls GET /alerts/stats/summary", async () => {
      mockApiClient.get.mockResolvedValueOnce({
        data: { total: 42, by_status: { pending: 10 }, average_score: 65.3 },
      });

      const result = await api.getAlertStats();

      expect(mockApiClient.get).toHaveBeenCalledWith("/alerts/stats/summary");
      expect(result.total).toBe(42);
    });
  });

  describe("auth API methods (via authClient)", () => {
    it("login sends form-encoded credentials", async () => {
      mockAuthClient.post.mockResolvedValueOnce({
        data: {
          access_token: "access-123",
          refresh_token: "refresh-456",
          token_type: "bearer",
          expires_in: 1800,
        },
      });

      const result = await api.login("admin", "admin123");

      expect(mockAuthClient.post).toHaveBeenCalledWith(
        "/login",
        expect.any(URLSearchParams),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
      );
      expect(result.access_token).toBe("access-123");
    });

    it("refreshToken calls POST /refresh", async () => {
      mockAuthClient.post.mockResolvedValueOnce({
        data: {
          access_token: "new-access",
          refresh_token: "new-refresh",
          token_type: "bearer",
          expires_in: 1800,
        },
      });

      const result = await api.refreshToken("old-refresh");

      expect(mockAuthClient.post).toHaveBeenCalledWith("/refresh", {
        refresh_token: "old-refresh",
      });
      expect(result.access_token).toBe("new-access");
    });

    it("getMe calls GET /me", async () => {
      mockAuthClient.get.mockResolvedValueOnce({
        data: { id: "u-1", username: "admin", role: "admin" },
      });

      const result = await api.getMe();

      expect(mockAuthClient.get).toHaveBeenCalledWith("/me");
      expect(result.username).toBe("admin");
    });
  });
});
