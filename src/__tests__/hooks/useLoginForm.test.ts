import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
    isAuthenticated: false,
  }),
}));

import { useLoginForm } from "../../hooks/useLoginForm";

describe("useLoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes with empty fields and no error", () => {
    const { result } = renderHook(() => useLoginForm());

    expect(result.current.username).toBe("");
    expect(result.current.password).toBe("");
    expect(result.current.error).toBeNull();
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.showPassword).toBe(false);
  });

  it("updates username and password", () => {
    const { result } = renderHook(() => useLoginForm());

    act(() => result.current.setUsername("admin"));
    expect(result.current.username).toBe("admin");

    act(() => result.current.setPassword("admin123"));
    expect(result.current.password).toBe("admin123");
  });

  it("toggles password visibility", () => {
    const { result } = renderHook(() => useLoginForm());

    expect(result.current.showPassword).toBe(false);
    act(() => result.current.toggleShowPassword());
    expect(result.current.showPassword).toBe(true);
    act(() => result.current.toggleShowPassword());
    expect(result.current.showPassword).toBe(false);
  });

  it("calls login with username and password on submit", async () => {
    mockLogin.mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.setUsername("admin");
      result.current.setPassword("admin123");
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent);
    });

    expect(mockLogin).toHaveBeenCalledWith("admin", "admin123");
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/" });
  });

  it("sets error on failed login", async () => {
    mockLogin.mockRejectedValueOnce(new Error("Invalid credentials"));
    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.setUsername("wrong");
      result.current.setPassword("wrong");
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent);
    });

    expect(result.current.error).toBe("Invalid credentials");
    expect(result.current.isSubmitting).toBe(false);
  });

  it("sets isSubmitting during async login", async () => {
    let resolveLogin: () => void;
    mockLogin.mockReturnValueOnce(
      new Promise<void>((resolve) => {
        resolveLogin = resolve;
      }),
    );

    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.setUsername("admin");
      result.current.setPassword("admin123");
    });

    // Start submit — don't await yet
    let submitPromise: Promise<void>;
    act(() => {
      submitPromise = result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent);
    });

    expect(result.current.isSubmitting).toBe(true);

    // Resolve login
    await act(async () => {
      resolveLogin!();
      await submitPromise!;
    });

    expect(result.current.isSubmitting).toBe(false);
  });

  it("prevents default form submission", async () => {
    mockLogin.mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useLoginForm());
    const preventDefault = vi.fn();

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault,
      } as unknown as React.FormEvent);
    });

    expect(preventDefault).toHaveBeenCalledOnce();
  });
});
