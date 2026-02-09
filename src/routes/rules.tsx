import { createFileRoute } from "@tanstack/react-router";
import { createVariantSwitcher } from "../utils/createVariantSwitcher";
import { useRules, type RulesData } from "../hooks/useRules";

const RulesSwitcher = createVariantSwitcher<RulesData>({
  brutalist: () => import("../variants/brutalist/Rules"),
  terminal: () => import("../variants/terminal/Rules"),
});

export const Route = createFileRoute("/rules")({
  component: RulesPage,
});

function RulesPage() {
  const data = useRules();
  return <RulesSwitcher {...data} />;
}
