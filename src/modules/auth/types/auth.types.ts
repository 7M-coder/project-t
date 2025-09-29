/**
 * Authentication related type definitions
 */

// Sign In Types
export interface SignInPayload {
  phone: string;
  country_code: string;
  password: string;
}

export interface SignInResponse {
  access_token: string;
  refresh_token: string;
  user: {
    country_code: string;
    phone: string;
    name: string;
    phone_verified: boolean;
    role: string;
    is_blocked: boolean;
    user_metadata: Record<string, any>;
    id: number;
  };
}
export interface SignInOtpResponse {
  detail: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

// User Type
export interface User {
  email: string;
  display_name: string;
  pk?: number;
}
// Sign Up Types
export interface SignUpPayload {
  email: string;
  password1: string;
  password2: string;
  nick_name: string;
  marital_status: string;
  gender: string;
  birthday: string; // Should be in YYYY-MM-DD format after conversion
  registered_from: string;
}

export interface SignUpOtpResponse {
  detail: string;
}

// Nickname Check Types
export interface NicknameCheckPayload {
  nickname: string;
}

export interface NicknameCheckResponse {
  is_available: boolean;
  message: string;
  suggestions: string[];
  errors: string[];
}

// Auth Form Error Types
export interface BackendErrorResponse {
  error?: string[];
  detail?: string;
}

// forgot password
export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  detail: string;
}
export interface VerifyPasswordOtpPayload {
  email: string;
  otp: string;
}
export interface ForgotPasswordOtpSuccessResponse {
  detail: string;
}
export interface ForgotPasswordOtpFailureResponse {
  email: [string];
}
export interface ResetPasswordPayload {
  email: string;
  otp: string;
  new_password1: string;
  new_password2: string;
}
export interface ResetPasswordSuccessResponse {
  detail: string;
}
export interface ResetPasswordFailureResponse {
  email: [string];
}
