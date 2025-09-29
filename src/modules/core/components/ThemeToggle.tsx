import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import Button from './Button'

/**
 * A button component that toggles between light and dark themes
 * @returns {React.ReactElement} The theme toggle button
 */
const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <Button
      onClick={toggleTheme}
      buttonText=""
      className=""
      icon={isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
      buttonType="default"
      // className="rounded-md  bg-theme-surface text-primary hover:text-accent hover:border-accent flex items-center justify-center w-10 h-10 transition-all duration-200"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    />
  )
}

export default ThemeToggle
