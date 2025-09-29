import React, { lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { StyleProvider } from "@ant-design/cssinjs";
import "./antd/overrides.css";
import "./index.css";
import useLocalizeDocumentAttributes from "./i18n/useLocalizeDocumentAttributes";
import LanguageProvider from "./context/LanguageProvider";
import ThemeProvider from "./context/ThemeProvider";
import ProtectedRoute from "./modules/core/components/ProtectedRoute";
import { useTranslation } from "react-i18next";
import { UsersPage } from "./modules/users/pages/UsersPage";
import ChangeInfoPage from "./modules/users/pages/ChangeInfoPage";

// Lazy loading components using aliases
const LoginPage = lazy(() => import("@/modules/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/modules/auth/pages/RegisterPage"));
const HomePage = lazy(() => import("./modules/core/pages/HomePage"));
const NotFound = lazy(() => import("./modules/core/pages/NotFound"));

// Supported languages
const SUPPORTED_LANGUAGES = ["ar", "en"];
const DEFAULT_LANGUAGE = "ar";

/**
 * Main application component that sets up routing and localization.
 * @returns {React.JSX.Element} The main application component wrapped with necessary providers.
 * @description
 * This component configures:
 * - Localization of document attributes using `useLocalizeDocumentAttributes`.
 * - Protected, public, and auth routes with language-prefixed paths.
 * - Default language redirection for unsupported paths.
 * - React Router for handling navigation with suspense fallback for lazy-loaded components.
 * - Theme configuration using Ant Design's ConfigProvider.
 */
function App(): React.JSX.Element {
  useLocalizeDocumentAttributes();
  const { i18n } = useTranslation();
  const currentLang = localStorage.getItem("i18nLang") ?? i18n.resolvedLanguage;

  // Define the protected routes that should be available in each language
  const protectedRoutes = [
    { path: "", element: <HomePage /> },
    { path: "users", element: <UsersPage /> },
    { path: "update-personal-information", element: <ChangeInfoPage /> },
  ];

  // Define the public routes that should be available in each language

  // Define auth routes
  const authRoutes = [
    { path: "login", element: <LoginPage /> },
    { path: "register", element: <RegisterPage /> },
  ];

  return (
    //Style provider: to override antd styles by tailwind styles, for example <button className="bg-accent"> will not override antd button bg color without this provider
    <StyleProvider layer>
      {/* Theme provider: feeds the app with antd config, light and dark theme, default colors*/}
      <ThemeProvider>
        <Router>
          <LanguageProvider>
            <Routes>
              {/* Redirect root to default language */}
              <Route
                path="/"
                element={
                  <Navigate
                    to={`/${currentLang ? currentLang : DEFAULT_LANGUAGE}`}
                  />
                }
              />
              <Route
                path="*"
                element={
                  <Navigate
                    to={`/${currentLang ?? DEFAULT_LANGUAGE}`}
                    replace
                  />
                }
              />
              {/* Generate routes for each supported language */}
              {SUPPORTED_LANGUAGES.map((lang) => (
                <React.Fragment key={`lang-group-${lang}`}>
                  {/* Protected routes */}
                  {protectedRoutes.map((route) => (
                    <Route
                      key={`${lang}-${route.path}`}
                      path={`/${lang}${route.path ? `/${route.path}` : ""}`}
                      element={<ProtectedRoute>{route.element}</ProtectedRoute>}
                    />
                  ))}

                  {/* Catch-all route for this language */}
                  <Route
                    key={`${lang}-not-found`}
                    path={`/${lang}/*`}
                    element={<NotFound />}
                  />
                </React.Fragment>
              ))}

              {/* Auth routes */}
              {SUPPORTED_LANGUAGES.map((lang) =>
                authRoutes.map((route) => (
                  <Route
                    key={`${lang}-${route.path}`}
                    path={`/${lang}/${route.path}`}
                    element={route.element}
                  />
                ))
              )}
            </Routes>
          </LanguageProvider>
        </Router>
      </ThemeProvider>
    </StyleProvider>
  );
}

export default App;
