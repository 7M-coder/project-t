import React from 'react'
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.JSX.Element
}

/**
 * ProtectedRoute component ensures that only authenticated users can access certain routes.
 * If the user is not authenticated (i.e., no ACCESS_TOKEN in localStorage),
 * it redirects them to the login page.
 *
 * @param {object} props - The component props.
 * @param {React.JSX.Element} props.children - The child element(s) to render when authenticated.
 * @returns {React.JSX.Element} The child element(s) if authenticated, otherwise a redirection to the login page.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Check if the user is authenticated by verifying if the token exists.
  const token = localStorage.getItem('ACCESS_TOKEN')

  if (!token) {
    // Optionally, add language-specific redirection (e.g., /en/login or /ar/login)
    return <Navigate to="/ar/login" replace />
  }

  return children
}

export default ProtectedRoute
