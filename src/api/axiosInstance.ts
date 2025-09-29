import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import i18next from 'i18next'
import { AUTH } from '@/api/endpoints'
import { APP_CONFIG } from '@/config/app.config'

const { STORAGE_KEYS } = APP_CONFIG.AUTH
const { TIMEOUT, BASE_URL } = APP_CONFIG.API

/**
 * Creates an Axios instance with optional token-based authentication.
 * @param {string | null} token - The authentication token (optional).
 * @returns {AxiosInstance} The configured Axios instance.
 */
const axiosClient = (token: string | null = null): AxiosInstance => {
  // Construct the base URL dynamically based on the current locale
  const getBaseURL = (): string => {
    return BASE_URL
  }

  // Initialize default headers, optionally including an Authorization header if a token is provided
  const initialHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }

  // Create an Axios instance with the dynamic base URL and initial headers
  const client = axios.create({
    baseURL: getBaseURL(),
    headers: initialHeaders,
    timeout: TIMEOUT,
    withCredentials: false
  })

  // Request interceptor to attach the latest access token from localStorage if available
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // Check if the request URL is for login or registration
    if (config.url && (config.url.includes(AUTH.SIGN_IN) || config.url.includes(AUTH.SIGN_UP))) {
      return config // Skip attaching token for these endpoints
    }

    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  // Response interceptor: refresh token on 401 errors and retry original request
  client.interceptors.response.use(
    (response: AxiosResponse) => response,

    async (error: AxiosError) => {
      // Determine if debug logging is enabled
      const isDebugEnabled =
        import.meta.env.REACT_APP_DEBUG === 'true' || import.meta.env.MODE === 'development'

      // Check for network/server error
      if (!error.response) {
        if (isDebugEnabled) {
          console.error('Network/Server error:', error)
        }
        const translatedError = i18next.t('networkError', { ns: 'common' })
        return Promise.reject(new Error(translatedError))
      }

      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
      const response = error.response

      if (response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
        if (refreshToken) {
          try {
            interface RefreshResponseData {
              access: string
              refresh?: string
            }
            const refreshResponse = await axios.post<RefreshResponseData>(
              `${getBaseURL()}auth/token/refresh/`,
              { refresh: refreshToken },
              {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: false
              }
            )

            const { access: newAccessToken, refresh: newRefreshToken } = refreshResponse.data

            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken)
            if (newRefreshToken) {
              localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken)
            }

            // Update the authorization header of the original request with the new access token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

            // Retry the original request with updated headers and return its promise
            return await client(originalRequest)
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError)
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
            // Optionally: redirect user to login page or handle logout logic
          }
        }
      }

      // Conditional logging of response error details
      if (isDebugEnabled) {
        console.log('Response Error', response.status, response.data)
      }

      // For other cases of 401 or failures, remove the access token
      if (response.status === 401) {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      }

      return Promise.reject(error)
    }
  )

  return client
}

export default axiosClient
