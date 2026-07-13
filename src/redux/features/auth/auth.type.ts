export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  bio: string;
  created_at: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  user: User;
  refresh: string;
  access: string;
}

export interface SendOtpRequest {
  email: string;
  purpose: string;
}

export interface SendOtpResponse {
  message: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
  purpose: string;
}

export interface VerifyOtpResponse {
  message: string;
}

export interface ResetPasswordRequest {
  email: string;
  new_password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface ChangePasswordResponse {
  message?: string;
  detail?: string;
}
