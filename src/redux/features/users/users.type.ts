export interface User {
  id: string;
  name: string;
  email: string;
  role: "reader" | "author" | "editor" | "admin";
  avatar: string | null;
  bio: string;
  is_active: boolean;
  is_email_verified: boolean;
  created_at: string;
}

export interface GetUsersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}

export interface GetUsersQueryArg {
  page?: number;
  search?: string;
  role?: string;
  is_active?: boolean;
  is_email_verified?: boolean;
}

export interface UpdateUserRequest {
  id: string;
  data: {
    name: string;
    role: "reader" | "author" | "editor" | "admin";
    avatar?: string | null;
    bio?: string;
    is_active: boolean;
    is_email_verified: boolean;
  };
}

export interface UpdateUserResponse {
  id: string;
  name: string;
  email: string;
  role: "reader" | "author" | "editor" | "admin";
  avatar: string | null;
  bio: string;
  is_active: boolean;
  is_email_verified: boolean;
  created_at: string;
}
