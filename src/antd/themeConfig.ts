/* 
for reference: https://ant.design/docs/customize-theme
*/
import { theme } from "antd";
import type { ThemeConfig } from "antd";

// Common token settings for both themes
const commonTokens = {
  borderRadius: 10,
  fontFamily: "Tajawal",
  fontWeightStrong: 900,
  fontWeightMedium: 600,
  fontWeightLight: 300,
};

// Light theme configuration
export const lightTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    ...commonTokens,
    colorPrimary: "#2563eb",
    colorBgBase: "#f9fafb",
    colorBgContainer: "#ffffff",
    colorTextBase: "#1e293b",
    colorText: "#1e293b",
    colorTextHeading: "#2563eb",
    colorTextDescription: "#64748b",
    colorTextSecondary: "#64748b",
    colorTextDisabled: "#d1d5db",
    colorTextPlaceholder: "#94a3b8",
    colorSuccess: "#22c55e",
    colorError: "#ef4444",
    colorLink: "#2563eb",
    colorBorder: "#d1d5db",
    borderRadius: 8,
    fontFamily: "Tajawal",
  },
};

// Dark theme configuration
export const darkTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    ...commonTokens,
    colorPrimary: "#60a5fa",
    colorBgBase: "#1e293b",
    colorBgContainer: "#273043",
    colorTextBase: "#f1f5f9",
    colorText: "#f1f5f9",
    colorTextHeading: "#60a5fa",
    colorTextDescription: "#94a3b8",
    colorTextSecondary: "#94a3b8",
    colorTextDisabled: "#334155",
    colorTextPlaceholder: "#64748b",
    colorSuccess: "#22c55e",
    colorError: "#ef4444",
    colorLink: "#60a5fa",
    colorBorder: "#334155",
    borderRadius: 8,
  },
};

/**
 * Returns the appropriate Ant Design theme configuration based on dark mode preference
 * @param {boolean} isDark - Whether dark mode is enabled
 * @returns {ThemeConfig} The corresponding theme configuration
 */
export const getThemeConfig = (isDark: boolean): ThemeConfig => {
  return isDark ? darkTheme : lightTheme;
};
