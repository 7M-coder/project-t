export interface AdminUser {
  id: number;
  name: string;
  country_code: string;
  phone: string;
  role: string;
  created_at: string;
  updated_at: string;
  is_blocked: boolean;
  phone_verified: boolean;
}
export interface AdminUsers {
  users: AdminUser[];
}
export interface UpdateUserPayload {
  country_code: string;
  phone: string;
  name: string;
}
