import { createFileRoute } from "@tanstack/react-router";
import { createVariantSwitcher } from "../utils/createVariantSwitcher";

const LoginSwitcher = createVariantSwitcher<Record<string, never>>({
  brutalist: () => import("../variants/brutalist/Login"),
  terminal: () => import("../variants/terminal/Login"),
});

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  return <LoginSwitcher />;
}
