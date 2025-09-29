import React from 'react'
import { useTranslation } from 'react-i18next'
import AuthLayout from '../layouts/AuthLayout'
import SignInForm from '../components/SignInForm'

/**
 * LoginPage Component
 *
 * Renders the login page using the AuthLayout and SignInForm components.
 *
 * @returns {JSX.Element} The rendered login page.
 */
const LoginPage: React.FC = () => {
  const { t } = useTranslation('auth') // Translate the title as well

  return (
    <AuthLayout title={t('loginTitle')}>
      <SignInForm />
    </AuthLayout>
  )
}

export default LoginPage
