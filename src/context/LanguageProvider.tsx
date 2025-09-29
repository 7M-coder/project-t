import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { ReactNode, useEffect } from 'react'

/**
 * Props for the LanguageProvider component
 * @interface LanguageProviderProps
 * @property {ReactNode} children - Child components to be wrapped by the provider
 */
interface LanguageProviderProps {
  children: ReactNode
}

/**
 * Language synchronization provider component
 * @component
 * @param {LanguageProviderProps} props - Component properties
 * @returns {React.JSX.Element} Provider wrapper with language synchronization logic
 *
 * @example
 * // Usage in root component or router configuration
 * <LanguageProvider>
 *   <AppRoutes />
 * </LanguageProvider>
 *
 * @description
 * This component:
 * - Automatically syncs UI language with URL path (/en or /ar)
 * - Listens for URL changes to update language
 * - Uses react-i18next for language management
 * - Works with React Router's location system
 */
const LanguageProvider = ({ children }: LanguageProviderProps): React.JSX.Element => {
  const { i18n } = useTranslation()
  const location = useLocation()

  /**
   * Language synchronization effect
   * @description
   * - Detects language from URL path segments
   * - Updates i18n language when mismatch detected
   * - Handles async language change properly
   */
  useEffect(() => {
    /** @const {string} storedLang - Language stored in localStorage */
    const storedLang = localStorage.getItem('i18nextLng') ?? 'ar'

    /** @const {string} lang - Detected language from URL path or fallback to stored language */
    const lang =
      location.pathname === '/' ? storedLang : location.pathname.startsWith('/ar') ? 'ar' : 'en'

    if (i18n.language !== lang) {
      void i18n.changeLanguage(lang) // Intentional void for promise cleanup
      localStorage.setItem('i18nextLng', lang)
    }
  }, [location.pathname, i18n])

  return <>{children}</>
}

export default LanguageProvider
