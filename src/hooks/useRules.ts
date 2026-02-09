import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type FraudRule, type PaginatedResponse } from "../services/api";
import { toaster } from "../components/ui/toaster";

export interface Rule {
  code: string;
  name: string;
  description: string;
  category: string;
  severity: string;
  score: number;
  conditions: string | object;
  enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export function formatConditions(
  conditions: string | object | undefined,
): string {
  if (!conditions) return "N/A";
  if (typeof conditions === "string") return conditions;
  if (typeof conditions === "object") {
    if (
      "field" in conditions &&
      "operator" in conditions &&
      "value" in conditions
    ) {
      const c = conditions as {
        field: string;
        operator: string;
        value: unknown;
      };
      return `${c.field} ${c.operator} ${c.value}`;
    }
    return JSON.stringify(conditions);
  }
  return "N/A";
}

function parseConditions(input: string | object): Record<string, unknown> {
  if (typeof input === "object") return input as Record<string, unknown>;
  const trimmed = (input as string).trim();
  // Try JSON first
  try {
    return JSON.parse(trimmed);
  } catch {
    // Parse simple "field operator value" format
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 3) {
      const field = parts[0];
      const operator = parts[1];
      const raw = parts.slice(2).join(" ");
      const numVal = Number(raw);
      return { field, operator, value: isNaN(numVal) ? raw : numVal };
    }
    return { raw: trimmed };
  }
}

export interface RulesData {
  rules: FraudRule[];
  data: PaginatedResponse<FraudRule> | undefined;
  isLoading: boolean;
  isSaving: boolean;
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
  editingRule: Partial<Rule>;
  setEditingRule: (val: Partial<Rule>) => void;
  toggleRule: (code: string) => void;
  openNewRuleModal: () => void;
  openEditRuleModal: (rule: Rule) => void;
  handleSaveRule: (e: React.FormEvent) => void;
}

export function useRules(): RulesData {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Partial<Rule>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["rules"],
    queryFn: () => api.getRules({ size: 100 }),
  });

  const toggleMutation = useMutation({
    mutationFn: (code: string) => api.toggleRule(code),
    onSuccess: (updatedRule) => {
      toaster.create({
        title: "Rule Updated",
        description: `Rule "${updatedRule.name}" has been ${updatedRule.enabled ? "enabled" : "disabled"}`,
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["rules"] });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Failed to update rule",
        type: "error",
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: (rule: Omit<FraudRule, "created_at" | "updated_at">) =>
      api.createRule(rule),
    onSuccess: (newRule) => {
      toaster.create({
        title: "Rule Created",
        description: `Rule "${newRule.name}" has been created`,
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["rules"] });
      setIsModalOpen(false);
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Failed to create rule",
        type: "error",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      code,
      updates,
    }: {
      code: string;
      updates: Partial<FraudRule>;
    }) => api.updateRule(code, updates),
    onSuccess: (updatedRule) => {
      toaster.create({
        title: "Rule Updated",
        description: `Rule "${updatedRule.name}" has been updated`,
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["rules"] });
      setIsModalOpen(false);
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Failed to update rule",
        type: "error",
      });
    },
  });

  const openNewRuleModal = () => {
    setEditingRule({
      name: "",
      code: "",
      category: "",
      severity: "low",
      score: 0,
      description: "",
      conditions: "",
      enabled: true,
    });
    setIsModalOpen(true);
  };

  const openEditRuleModal = (rule: Rule) => {
    setEditingRule({
      ...rule,
      conditions: formatConditions(rule.conditions),
    });
    setIsModalOpen(true);
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();

    const conditions = parseConditions(editingRule.conditions || "");
    const isEditing = !!editingRule.created_at;

    if (isEditing) {
      updateMutation.mutate({
        code: editingRule.code!,
        updates: {
          name: editingRule.name || "",
          description: editingRule.description || null,
          category: editingRule.category || "",
          severity: editingRule.severity || "low",
          score: editingRule.score || 0,
          enabled: editingRule.enabled ?? true,
          conditions,
        },
      });
    } else {
      createMutation.mutate({
        code: editingRule.code || "",
        name: editingRule.name || "",
        description: editingRule.description || null,
        category: editingRule.category || "",
        severity: editingRule.severity || "low",
        score: editingRule.score || 0,
        enabled: editingRule.enabled ?? true,
        conditions,
        effective_from: null,
        effective_to: null,
      });
    }
  };

  return {
    rules: data?.items || [],
    data,
    isLoading,
    isSaving: createMutation.isPending || updateMutation.isPending,
    isModalOpen,
    setIsModalOpen,
    editingRule,
    setEditingRule,
    toggleRule: (code: string) => toggleMutation.mutate(code),
    openNewRuleModal,
    openEditRuleModal,
    handleSaveRule,
  };
}
