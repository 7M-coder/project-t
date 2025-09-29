import { createContext } from "react";

/**
 * Theme context interface definition
 */
export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

/**
 * Context for providing theme information throughout the application
 */
export const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,

  toggleTheme: () => undefined,
});
