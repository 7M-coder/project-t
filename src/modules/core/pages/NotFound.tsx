import React from 'react'
import { Result, Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigateTo } from '@/hooks/useNavigateTo'

/**
 * 404 Not Found page component
 * @component
 * @returns {React.JSX.Element} A 404 error page with a button to navigate back to the home page
 *
 * @example
 * // Usage in router configuration
 * <Route path="*" element={<NotFound />} />
 *
 * @description
 * This component:
 * - Displays a 404 error message using Ant Design's Result component
 * - Provides a button to navigate back to the home page
 * - Supports internationalization for the subtitle and button text
 * - Uses React Router's navigation for seamless routing
 *
 */
const NotFound: React.FC = () => {
  const navigate = useNavigateTo()
  const { t } = useTranslation('notFound')

  /**
   * Handles navigation to the home page
   * @function handleGoHome
   * @returns {void}
   */
  const handleGoHome = () => {
    navigate()
  }

  return (
    <Result
      status="404"
      title="404"
      subTitle={t('subTitle')}
      extra={
        <Button type="primary" onClick={handleGoHome}>
          {t('goHome')}
        </Button>
      }
    />
  )
}

export default NotFound
