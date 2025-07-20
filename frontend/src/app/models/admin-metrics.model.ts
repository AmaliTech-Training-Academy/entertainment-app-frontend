// models/admin-metrics.ts
export interface AdminMetrics {
  userCount: number;
  mediaCount: number;
}

export interface AdminMetricsResponse {
  data: AdminMetrics;
  status: number;
  success: boolean;
  error: string | null;
  message: string | null;
  timestamp: string;
}
