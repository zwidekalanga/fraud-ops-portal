import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type HealthStatus, type SystemConfig } from "../services/api";

export interface SettingsData {
  health: HealthStatus | undefined;
  isLoading: boolean;
  config: SystemConfig | undefined;
  isConfigLoading: boolean;
  updateConfig: (updates: Partial<SystemConfig>) => void;
  isUpdating: boolean;
}

export function useSettings(): SettingsData {
  const queryClient = useQueryClient();

  const { data: health, isLoading } = useQuery({
    queryKey: ["health"],
    queryFn: api.getHealth,
    refetchInterval: 30000,
  });

  const { data: config, isLoading: isConfigLoading } = useQuery({
    queryKey: ["system-config"],
    queryFn: api.getConfig,
  });

  const mutation = useMutation({
    mutationFn: (updates: Partial<SystemConfig>) => api.updateConfig(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-config"] });
    },
  });

  return {
    health,
    isLoading,
    config,
    isConfigLoading,
    updateConfig: mutation.mutate,
    isUpdating: mutation.isPending,
  };
}
