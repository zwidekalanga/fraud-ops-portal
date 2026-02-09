import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  api,
  type AlertReview,
  type CustomerSummary,
  type FraudAlert,
} from "../services/api";
import { toaster } from "../components/ui/toaster";

export interface AlertDetailData {
  alert: FraudAlert | undefined;
  isLoading: boolean;
  customer: CustomerSummary | undefined;
  isCustomerLoading: boolean;
  reviewNotes: string;
  setReviewNotes: (val: string) => void;
  handleReview: (status: AlertReview["status"]) => void;
  isReviewing: boolean;
}

export function useAlertDetail(id: string): AlertDetailData {
  const queryClient = useQueryClient();
  const [reviewNotes, setReviewNotes] = useState("");

  const { data: alert, isLoading } = useQuery({
    queryKey: ["alert", id],
    queryFn: () => api.getAlert(id),
  });

  const { data: customer, isLoading: isCustomerLoading } = useQuery({
    queryKey: ["customer-summary", alert?.customer_id],
    queryFn: () => api.getCustomerSummary(alert!.customer_id),
    enabled: !!alert?.customer_id,
  });

  const reviewMutation = useMutation({
    mutationFn: (review: AlertReview) => api.reviewAlert(id, review),
    onSuccess: () => {
      toaster.create({
        title: "Alert Reviewed",
        description: "The alert has been successfully reviewed",
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["alert", id] });
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      queryClient.invalidateQueries({ queryKey: ["alert-stats"] });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Failed to review alert",
        type: "error",
      });
    },
  });

  const handleReview = (status: AlertReview["status"]) => {
    reviewMutation.mutate({
      status,
      notes: reviewNotes || undefined,
    });
  };

  return {
    alert,
    isLoading,
    customer,
    isCustomerLoading,
    reviewNotes,
    setReviewNotes,
    handleReview,
    isReviewing: reviewMutation.isPending,
  };
}
