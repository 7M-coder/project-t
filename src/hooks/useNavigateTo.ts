import { useNavigate, NavigateOptions } from 'react-router-dom'
import i18n from 'i18next'

// Define a type for the navigation state
interface NavigationState {
  email?: string
  otp?: string
}

/**
 * A hook that returns a function to navigate to a route with the current
 * language prepended to the route.
 *
 * @returns A function that takes a route string and optional state object,
 * and navigates to the route with the current language prepended to it.
 *
 * @example
 * const navigateTo = useNavigateTo()
 * navigateTo('verify-login', { email: 'user@example.com', requestId: '123' })
 * // Navigates to '/ar/verify-login' with state if the current language is 'ar'
 */
export const useNavigateTo = () => {
  const navigate = useNavigate()
  const currentLanguage = i18n.resolvedLanguage ?? 'ar'

  const navigateTo = (route = '', state?: NavigationState) => {
    const options: NavigateOptions | undefined = state ? { state } : undefined
    void navigate(`/${currentLanguage}/${route}`, options)
  }

  return navigateTo
}
