import { createFileRoute } from "@tanstack/react-router";
import { createVariantSwitcher } from "../../utils/createVariantSwitcher";
import { useAlertsList, type AlertsListData } from "../../hooks/useAlertsList";

const AlertsSwitcher = createVariantSwitcher<AlertsListData>({
  brutalist: () => import("../../variants/brutalist/Alerts"),
  terminal: () => import("../../variants/terminal/Alerts"),
});

export const Route = createFileRoute("/alerts/")({
  component: AlertsPage,
});

function AlertsPage() {
  const data = useAlertsList();
  return <AlertsSwitcher {...data} />;
}
