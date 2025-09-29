import { USER } from "@/api/endpoints";
import { AdminUser, AdminUsers, UpdateUserPayload } from "../types/users.types";
import axiosClient from "@/api/axiosInstance";

export const getAllUsers = async (): Promise<AdminUsers> => {
  const api = axiosClient();
  const response = await api.get<AdminUsers>(USER.ALL);
  return response.data;
};

export const updateUser = async (payload: UpdateUserPayload): Promise<AdminUser> => {
  const api = axiosClient();
  const ACCESS_TOKEN = localStorage.getItem('ACCESS_TOKEN');
  api.defaults.headers.common['token'] = ACCESS_TOKEN;
  const response = await api.put<AdminUser>(USER.UPDATE, payload);
  return response.data;
};
