import Button from '@/modules/core/components/Button'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

/**
 * Language switcher component that toggles between Arabic and English
 * @component
 * @returns {React.JSX.Element} Accessible button element for language toggling
 */
export default function LanguageSwitcher(): React.JSX.Element {
  const { i18n } = useTranslation()
  const navigate = useNavigate()

  const toggleLanguage = () => {
    const currentLang = i18n.resolvedLanguage ?? 'en'
    const newLang = currentLang === 'ar' ? 'en' : 'ar'
    const newPath = window.location.pathname.replace(`/${currentLang}`, `/${newLang}`)

    void i18n.changeLanguage(newLang)
    void navigate(newPath, { replace: true })
  }

  return (
    <div className="flex items-center h-full">
      <Button
        onClick={toggleLanguage}
        buttonText={i18n.resolvedLanguage === 'ar' ? 'EN' : 'ع'}
        aria-label="Toggle language"
        buttonType="default"
        className="w-10 h-10"
      />
    </div>
  )
}
