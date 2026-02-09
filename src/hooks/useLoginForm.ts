import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../contexts/AuthContext";

export interface LoginFormState {
  username: string;
  password: string;
  showPassword: boolean;
  error: string | null;
  isSubmitting: boolean;
  isAuthenticated: boolean;
  setUsername: (v: string) => void;
  setPassword: (v: string) => void;
  toggleShowPassword: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function useLoginForm(): LoginFormState {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(username, password);
      navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    username,
    password,
    showPassword,
    error,
    isSubmitting,
    isAuthenticated,
    setUsername,
    setPassword,
    toggleShowPassword: () => setShowPassword((p) => !p),
    handleSubmit,
  };
}
