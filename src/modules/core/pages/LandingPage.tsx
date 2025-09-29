import LandingLayout from '../layouts/LandingLayout'

/**
 * Landing page component - Main entry point for landing page
 * @component
 * @returns {React.JSX.Element} Page structure with main layout and landing content
 *
 * @example
 * // Usage in router configuration
 * <Route path="/" element={<LandingPage />} />
 *
 * @description
 * This page component:
 * - Wraps the landing page content in the main application layout
 * - Serves as the root component for the root route
 * - Provides consistent page structure through LandingLayout
 * - Can be extended with page-specific SEO tags or data fetching
 */
export default function LandingPage() {
  return (
    <LandingLayout>
      <main className="min-h-screen bg-theme-background p-8 text-primary">
        <h1 className="font-bold">الصفحة الرئيسية</h1>
      </main>
    </LandingLayout>
  )
}
