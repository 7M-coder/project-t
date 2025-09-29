import axiosClient from "@/api/axiosInstance";
import { AUTH } from "@/api/endpoints";
import { APP_CONFIG } from "@/config/app.config";
import { SignInPayload, SignInResponse } from "../types/auth.types";
const { STORAGE_KEYS } = APP_CONFIG.AUTH;

/**
 * Handles user sign-in step 1: sends credentials to the backend and receives OTP.
 * @param {SignInPayload} payload - The user's email and password.
 * @returns {Promise<SignInOtpResponse>} The response with OTP status.
 */
export const signIn = async (
  payload: SignInPayload
): Promise<SignInResponse> => {
  const api = axiosClient();
  const response = await api.post<SignInResponse>(AUTH.SIGN_IN, payload);
  return response.data;
};

/**
 * Handles user sign-out by sending the refresh token to the backend for blacklisting.
 * Removes tokens from localStorage after the sign-out process.
 * @returns {Promise<void>} A promise that resolves when the sign-out process is complete.
 */
export const signOut = async (): Promise<void> => {
  const api = axiosClient();
  const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN); // Retrieve the refresh token

  try {
    // Send the refresh token to the backend for blacklisting
    if (refreshToken) {
      await api.post(AUTH.SIGN_OUT, { refresh: refreshToken });
    }
  } catch (error) {
    console.error("Error during sign-out request:", error);
  } finally {
    // Clear tokens from localStorage regardless of server response
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_INFO);
  }
};
