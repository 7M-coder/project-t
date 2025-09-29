import { useContext } from "react";
import { ThemeContext, ThemeContextType } from "../context/ThemeContext";

/**
 * Custom hook to access theme context
 * @returns {ThemeContextType} The theme context values
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  // According to TypeScript, context can't be undefined due to the default value
  // provided in ThemeContext.ts, but we'll check anyway for runtime safety
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
