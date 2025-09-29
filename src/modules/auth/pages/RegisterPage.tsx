import React from 'react'
import { useTranslation } from 'react-i18next'
import AuthLayout from '../layouts/AuthLayout'
import SignUpForm from '../components/SignUpForm'

/**
 * Renders the sign-up page.
 * @returns A JSX element representing the sign-up page.
 */
const RegisterPage: React.FC = () => {
  const { t } = useTranslation('auth')

  return (
    <AuthLayout title={t('signUpTitle')}>
      <SignUpForm />
    </AuthLayout>
  )
}

export default RegisterPage
