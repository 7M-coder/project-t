import React, { useEffect, useState } from "react";
import { ConfigProvider } from "antd";
import { getThemeConfig } from "../antd/themeConfig";
import { ThemeContext } from "./ThemeContext";

/**
 * ThemeProvider props interface
 */
interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Theme provider component that manages theme state and wraps the application
 * with the appropriate Ant Design theme configuration
 * @param {ThemeProviderProps} props - The component props
 * @returns {React.ReactElement} The theme provider component
 */
const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Check for user's preferred color scheme or saved preference
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    // If no saved preference, check system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // Apply theme class to HTML element when isDarkMode changes
  useEffect(() => {
    // Get the document element
    const htmlElement = document.documentElement;

    // Force a repaint to ensure classes are applied/removed correctly
    if (isDarkMode) {
      // First remove to ensure clean state
      htmlElement.classList.remove("light");
      // Then add dark class
      htmlElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      // First remove to ensure clean state
      htmlElement.classList.remove("dark");
      // Optionally add light class if needed
      htmlElement.classList.add("light");
      localStorage.setItem("theme", "light");
    }

    // Force a repaint for browsers that might have issues with class changes
    const currentDisplay = document.body.style.display;
    document.body.style.display = "none";
    void document.body.offsetHeight; // Trigger a reflow
    document.body.style.display = currentDisplay;
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ConfigProvider theme={getThemeConfig(isDarkMode)}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
