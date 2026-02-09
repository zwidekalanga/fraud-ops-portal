import { createFileRoute } from "@tanstack/react-router";
import { createVariantSwitcher } from "../utils/createVariantSwitcher";
import {
  useDashboardData,
  type DashboardData,
} from "../hooks/useDashboardData";

const DashboardSwitcher = createVariantSwitcher<DashboardData>({
  brutalist: () => import("../variants/brutalist/Dashboard"),
  terminal: () => import("../variants/terminal/Dashboard"),
});

export const Route = createFileRoute("/")({
  component: DashboardPage,
});

function DashboardPage() {
  const data = useDashboardData();
  return <DashboardSwitcher {...data} />;
}
