import { createFileRoute } from "@tanstack/react-router";
import { createVariantSwitcher } from "../utils/createVariantSwitcher";
import { useSettings, type SettingsData } from "../hooks/useSettings";

const SettingsSwitcher = createVariantSwitcher<SettingsData>({
  brutalist: () => import("../variants/brutalist/Settings"),
  terminal: () => import("../variants/terminal/Settings"),
});

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const data = useSettings();
  return <SettingsSwitcher {...data} />;
}
