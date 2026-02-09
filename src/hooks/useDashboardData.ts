import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import type {
  AlertStats,
  DailyVolume,
  FraudAlert,
  PaginatedResponse,
} from "../services/api";

export interface DashboardData {
  stats: AlertStats | undefined;
  recentAlerts: PaginatedResponse<FraudAlert> | undefined;
  dailyVolume: DailyVolume[] | undefined;
  isLoading: boolean;
}

export function useDashboardData(): DashboardData {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["alert-stats"],
    queryFn: api.getAlertStats,
  });

  const { data: recentAlerts, isLoading: alertsLoading } = useQuery({
    queryKey: ["recent-alerts"],
    queryFn: () => api.getAlerts({ size: 5 }),
  });

  const { data: dailyVolume, isLoading: volumeLoading } = useQuery({
    queryKey: ["daily-volume"],
    queryFn: () => api.getDailyVolume(7),
  });

  return {
    stats,
    recentAlerts,
    dailyVolume,
    isLoading: statsLoading || alertsLoading || volumeLoading,
  };
}
