export const APP_CONFIG = {
  AUTH: {
    OTP_VERIFICATION: {
      TIMER_DURATION: parseInt(String(import.meta.env.VITE_OTP_VERIFICATION_TIMER || '180'), 10), // 3 minutes in seconds
      RESEND_COOLDOWN: parseInt(String(import.meta.env.VITE_OTP_RESEND_COOLDOWN || '30'), 10) // seconds
    },
    STORAGE_KEYS: {
      ACCESS_TOKEN: 'ACCESS_TOKEN',
      REFRESH_TOKEN: 'REFRESH_TOKEN',
      USER_INFO: 'USER_INFO'
    }
  },
  API: {
    TIMEOUT: 60000,
    BASE_URL: String(import.meta.env.VITE_BACKEND_API_URL || '')
  }
}
