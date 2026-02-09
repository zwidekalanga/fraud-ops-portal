import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  api,
  type AlertFilters,
  type FraudAlert,
  type PaginatedResponse,
} from "../services/api";

export interface AlertsListData {
  data: PaginatedResponse<FraudAlert> | undefined;
  isLoading: boolean;
  filters: AlertFilters;
  setFilters: React.Dispatch<React.SetStateAction<AlertFilters>>;
  search: string;
  setSearch: (val: string) => void;
  statusFilter: string;
  handleStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleViewAll: () => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  selectedIds: Set<string>;
  toggleSelect: (id: string) => void;
  toggleSelectAll: () => void;
  clearSelection: () => void;
  exportSelected: () => void;
  isExporting: boolean;
}

export function useAlertsList(): AlertsListData {
  const [filters, setFilters] = useState<AlertFilters>({
    page: 1,
    size: 8,
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["alerts", filters],
    queryFn: () => api.getAlerts(filters),
  });

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setFilters((prev) => ({
      ...prev,
      status: e.target.value === "all" ? undefined : e.target.value,
      page: 1,
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setFilters((prev) => ({
      ...prev,
      customer_id: e.target.value || undefined,
      page: 1,
    }));
  };

  const handleViewAll = () => {
    setSearch("");
    setStatusFilter("all");
    setFilters({ page: 1, size: 8 });
  };

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    const pageIds = data?.items?.map((a) => a.id) ?? [];
    setSelectedIds((prev) => {
      const allSelected = pageIds.every((id) => prev.has(id));
      if (allSelected) {
        const next = new Set(prev);
        pageIds.forEach((id) => next.delete(id));
        return next;
      }
      return new Set([...prev, ...pageIds]);
    });
  }, [data]);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  // Export selected alerts
  const [isExporting, setIsExporting] = useState(false);

  const exportSelected = useCallback(async () => {
    if (selectedIds.size === 0) return;
    setIsExporting(true);
    try {
      // Gather selected alerts — use current page data + fetch any that aren't on current page
      const currentItems = data?.items ?? [];
      const onPage = currentItems.filter((a) => selectedIds.has(a.id));
      const missingIds = [...selectedIds].filter(
        (id) => !currentItems.some((a) => a.id === id),
      );

      // Fetch missing alerts individually
      const missing = await Promise.all(
        missingIds.map((id) => api.getAlert(id)),
      );
      const alerts = [...onPage, ...missing];

      const headers = [
        "Alert ID",
        "Customer ID",
        "Risk Score",
        "Decision",
        "Status",
        "Triggered Rules",
        "Amount",
        "Currency",
        "Channel",
        "Country",
        "Merchant",
        "Reviewed By",
        "Review Notes",
        "Created At",
      ];

      const escape = (val: string) => {
        if (val.includes(",") || val.includes('"') || val.includes("\n")) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      };

      const rows = alerts.map((a) => [
        a.id,
        a.customer_id,
        String(a.risk_score),
        a.decision,
        a.status,
        a.triggered_rules.map((r) => r.code).join("; "),
        a.transaction ? String(a.transaction.amount) : "",
        a.transaction?.currency ?? "",
        a.transaction?.channel ?? "",
        a.transaction?.location_country ?? "",
        a.transaction?.merchant_name ?? "",
        a.reviewed_by ?? "",
        a.review_notes ?? "",
        a.created_at,
      ]);

      const csv = [headers, ...rows]
        .map((r) => r.map(escape).join(","))
        .join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `alerts-export-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  }, [selectedIds, data]);

  return {
    data,
    isLoading,
    filters,
    setFilters,
    search,
    setSearch,
    statusFilter,
    handleStatusChange,
    handleSearchChange,
    handleViewAll,
    currentPage: data?.page || 1,
    totalPages: data?.pages || 1,
    totalItems: data?.total || 0,
    itemsPerPage: data?.size || 8,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
    exportSelected,
    isExporting,
  };
}
