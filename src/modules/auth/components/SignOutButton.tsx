import React from 'react'
import { signOut } from '../services/auth.services'
import { useTranslation } from 'react-i18next'
import { LogoutOutlined } from '@ant-design/icons'
import { message } from 'antd'
import { useNavigateTo } from '@/hooks/useNavigateTo'

/**
 * SignOutButton Component
 *
 * Renders a button that logs out the user by calling signOut and then navigates to the login page.
 *
 * @returns {JSX.Element} The rendered logout button.
 */
const SignOutButton: React.FC = () => {
  const navigate = useNavigateTo()
  const { t } = useTranslation('auth')

  // Determine if the current language direction is RTL.

  const handleLogout = async () => {
    try {
      await signOut()
      // After sign out, navigate to login page
      navigate('login')
    } catch {
      message.error('Logout failed. Please try again.', 5)
    }
  }

  return (
    <button
      type="button"
      className={`flex items-center gap-x-2`}
      onClick={() => void handleLogout()}
    >
      <LogoutOutlined />
      <span>{t('logout')}</span>
    </button>
  )
}

export default SignOutButton
