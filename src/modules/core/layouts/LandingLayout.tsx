import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useTheme } from '@/hooks/useTheme'

/**
 * A layout component for landing pages.
 *
 * Provides a consistent structure for landing pages by wrapping the given children
 * in a Navbar and Footer component.
 *
 * @param {ReactNode} children - The child elements to render within the layout.
 * @returns {React.JSX.Element} The rendered layout component with the given children.
 */
export default function LandingLayout({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useTheme()

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}
