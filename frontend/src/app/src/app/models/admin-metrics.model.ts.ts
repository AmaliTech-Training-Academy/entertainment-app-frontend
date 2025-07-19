export interface AdminMetrics {
  data: {
    userCount: number;
    mediaCount: number;
  };
  status: number;
  success: boolean;
  error: any;
  message: any;
  timestamp: string;
}
