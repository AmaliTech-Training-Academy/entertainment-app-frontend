export interface AdminUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  roles: string[];
  createdAt: string;
  lastUpdatedAt: string;
}

// models/paginated-response.model.ts
export interface PaginatedResponse<T> {
  data: {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
  status: number;
  success: boolean;
  message: string | null;
  error: string[] | null;
  timestamp: string;
}
