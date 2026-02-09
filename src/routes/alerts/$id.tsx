import { createFileRoute } from "@tanstack/react-router";
import { createVariantSwitcher } from "../../utils/createVariantSwitcher";
import {
  useAlertDetail,
  type AlertDetailData,
} from "../../hooks/useAlertDetail";

const AlertDetailSwitcher = createVariantSwitcher<AlertDetailData>({
  brutalist: () => import("../../variants/brutalist/AlertDetail"),
  terminal: () => import("../../variants/terminal/AlertDetail"),
});

export const Route = createFileRoute("/alerts/$id")({
  component: AlertDetailPage,
});

function AlertDetailPage() {
  const { id } = Route.useParams();
  const data = useAlertDetail(id);
  return <AlertDetailSwitcher {...data} />;
}
