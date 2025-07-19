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

export interface UserRoleUpdateResponse {
  data: UpdatedUser;
  status: number;
  success: boolean;
  message: string;
  timestamp: string;
}

export interface UpdatedUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  roles: string[];
  createdAt: string;
  lastUpdatedAt: string;
}


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

export interface UserRoleUpdateResponse {
  data: AdminUser;
  status: number;
  success: boolean;
  error?: string[];
  message: string;
  timestamp: string;
}
