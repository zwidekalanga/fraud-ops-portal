import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act, waitFor } from "@testing-library/react";
import React from "react";

// Mock useNavigate before importing AuthContext
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => vi.fn(),
}));

import { AuthProvider, useAuth } from "../../contexts/AuthContext";

// Helper component that exposes auth context for testing
function AuthConsumer({
  onAuth,
}: {
  onAuth: (auth: ReturnType<typeof useAuth>) => void;
}) {
  const auth = useAuth();
  React.useEffect(() => {
    onAuth(auth);
  });
  return (
    <div>
      <span data-testid="authenticated">
        {auth.isAuthenticated ? "yes" : "no"}
      </span>
      <span data-testid="username">{auth.user?.username ?? ""}</span>
      <span data-testid="loading">{auth.isLoading ? "yes" : "no"}</span>
    </div>
  );
}

function renderWithAuth(onAuth: (auth: ReturnType<typeof useAuth>) => void) {
  return render(
    <AuthProvider>
      <AuthConsumer onAuth={onAuth} />
    </AuthProvider>,
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("starts unauthenticated with no stored token", async () => {
    let authState: ReturnType<typeof useAuth> | null = null;
    renderWithAuth((auth) => {
      authState = auth;
    });

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("no");
    });

    expect(authState!.isAuthenticated).toBe(false);
    expect(authState!.user).toBeNull();
    expect(authState!.token).toBeNull();
  });

  it("rehydrates session from localStorage on mount", async () => {
    const mockUser = {
      id: "u-1",
      username: "admin",
      email: "admin@test.com",
      full_name: "Admin",
      role: "admin",
      is_active: true,
    };

    localStorage.setItem("sentinel-access-token", "valid-token");

    // Mock fetch for /auth/admin/me
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    } as Response);

    renderWithAuth(() => {});

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("no");
    });

    expect(screen.getByTestId("authenticated").textContent).toBe("yes");
    expect(screen.getByTestId("username").textContent).toBe("admin");
  });

  it("clears auth if rehydration /me call fails", async () => {
    localStorage.setItem("sentinel-access-token", "expired-token");

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 401,
    } as Response);

    renderWithAuth(() => {});

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("no");
    });

    expect(screen.getByTestId("authenticated").textContent).toBe("no");
    expect(localStorage.getItem("sentinel-access-token")).toBeNull();
  });

  it("login stores tokens and sets user", async () => {
    const mockTokenResponse = {
      access_token: "new-access",
      refresh_token: "new-refresh",
    };
    const mockUser = {
      id: "u-2",
      username: "analyst",
      email: "analyst@test.com",
      full_name: "Analyst",
      role: "analyst",
      is_active: true,
    };

    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTokenResponse,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      } as Response);

    let authState: ReturnType<typeof useAuth> | null = null;
    renderWithAuth((auth) => {
      authState = auth;
    });

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("no");
    });

    await act(async () => {
      await authState!.login("analyst", "analyst123");
    });

    expect(localStorage.getItem("sentinel-access-token")).toBe("new-access");
    expect(localStorage.getItem("sentinel-refresh-token")).toBe("new-refresh");
    expect(screen.getByTestId("authenticated").textContent).toBe("yes");
    expect(screen.getByTestId("username").textContent).toBe("analyst");
  });

  it("login throws on invalid credentials", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ detail: "Invalid username or password" }),
    } as unknown as Response);

    let authState: ReturnType<typeof useAuth> | null = null;
    renderWithAuth((auth) => {
      authState = auth;
    });

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("no");
    });

    await expect(
      act(async () => {
        await authState!.login("wrong", "wrong");
      }),
    ).rejects.toThrow("Invalid username or password");

    expect(screen.getByTestId("authenticated").textContent).toBe("no");
  });

  it("logout clears tokens and user state", async () => {
    const mockUser = {
      id: "u-3",
      username: "viewer",
      email: "viewer@test.com",
      full_name: "Viewer",
      role: "viewer",
      is_active: true,
    };

    localStorage.setItem("sentinel-access-token", "token");
    localStorage.setItem("sentinel-refresh-token", "refresh");

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    } as Response);

    let authState: ReturnType<typeof useAuth> | null = null;
    renderWithAuth((auth) => {
      authState = auth;
    });

    await waitFor(() => {
      expect(screen.getByTestId("authenticated").textContent).toBe("yes");
    });

    act(() => {
      authState!.logout();
    });

    expect(screen.getByTestId("authenticated").textContent).toBe("no");
    expect(localStorage.getItem("sentinel-access-token")).toBeNull();
    expect(localStorage.getItem("sentinel-refresh-token")).toBeNull();
  });

  it("hasRole returns correct boolean for user roles", async () => {
    const mockUser = {
      id: "u-4",
      username: "analyst",
      email: "analyst@test.com",
      full_name: "Analyst",
      role: "analyst",
      is_active: true,
    };

    localStorage.setItem("sentinel-access-token", "token");

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    } as Response);

    let authState: ReturnType<typeof useAuth> | null = null;
    renderWithAuth((auth) => {
      authState = auth;
    });

    await waitFor(() => {
      expect(screen.getByTestId("authenticated").textContent).toBe("yes");
    });

    expect(authState!.hasRole("analyst")).toBe(true);
    expect(authState!.hasRole("admin", "analyst")).toBe(true);
    expect(authState!.hasRole("admin")).toBe(false);
    expect(authState!.hasRole("viewer")).toBe(false);
  });
});
