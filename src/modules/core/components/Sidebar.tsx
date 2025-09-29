import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import {
  LaptopOutlined,
  NotificationOutlined,
  HomeOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, Button, theme } from "antd";
import { useNavigateTo } from "@/hooks/useNavigateTo";

const { Sider } = Layout;

/**
 * Interface for sidebar component props
 * @interface SidebarProps
 * @property {boolean} visible - Determines if sidebar is visible
 * @property {boolean} isMobile - Indicates mobile view state
 * @property {(visible: boolean) => void} onToggle - Visibility toggle handler
 */
interface SidebarProps {
  visible: boolean;
  isMobile: boolean;
  onToggle: (visible: boolean) => void;
}

/**
 * Subnavigation item structure
 * @interface Subnav
 * @property {string} key - Unique identifier for subnavigation
 * @property {string} label - Display text for subnavigation
 * @property {Array<{ key: string, label: string }>} options - Subnavigation items
 */
interface Subnav {
  key: string;
  label: string;
  options: {
    key: string;
    label: string;
  }[];
}

/**
 * Translated sidebar content structure
 * @interface SidebarTranslation
 * @property {string} home - Translated "Home" label
 * @property {Subnav[]} subnavs - Array of translated subnavigation items
 */
interface SidebarTranslation {
  home: string;
  subnavs: Subnav[];
}

/**
 * A responsive sidebar component with internationalization support and mobile-friendly behavior
 * @component
 * @param {SidebarProps} props - Component properties
 * @param {boolean} props.visible - Controls sidebar visibility (especially important for mobile)
 * @param {boolean} props.isMobile - Flag indicating mobile view state
 * @param {(visible: boolean) => void} props.onToggle - Callback for toggling sidebar visibility
 *
 * @example
 * @returns {React.JSX.Element}
 * // Basic usage
 * <Sidebar visible={isVisible} isMobile={isMobile} onToggle={handleToggle} />
 */
const Sidebar: React.FC<SidebarProps> = ({ visible, isMobile, onToggle }) => {
  const { t, i18n } = useTranslation("sidebar");
  const navigate = useNavigateTo();
  const location = useLocation();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  /**
   * Gets English label for a given key (used for URL generation)
   * @function getEnglishLabel
   * @param {string} key - The key to look up
   * @returns {string} English label for the given key
   * @private
   */
  const getEnglishLabel = (key: string): string => {
    try {
      // We need to explicitly load English data separately from the current UI language
      // This ensures we always have English data for routes regardless of UI language
      const englishData = t("en", {
        returnObjects: true,
      }) as SidebarTranslation;

      // Find the English label from the subnavs
      return (
        englishData.subnavs
          .flatMap((subnav) => subnav.options)
          .find((option) => option.key === key)?.label ?? key
      );
    } catch (error) {
      console.error("Error getting English label:", error);
      // Fallback mapping if translation fails
      const fallbackMap: Record<string, string> = {
        "1": "Users",
        "2": "Sessions",
        "3": "Forum",
        "4": "Exercises",
        "5": "My Programs",
        "6": "Notifications",
        "7": "Messages",
        "8": "Activity Log",
        "9": "Support",
      };
      return fallbackMap[key] || key;
    }
  };

  /**
   * Creates URL-safe slug from label text
   * @function createUrlSlug
   * @param {string} label - Text to convert
   * @returns {string} URL-friendly slug version of the label
   * @private
   */
  const createUrlSlug = (label: string) => {
    return label.toLowerCase().replace(/\s+/g, "-");
  };

  /**
   * Handles menu item clicks and navigation
   * @function handleMenuClick
   * @param {MenuProps} event - Ant Design menu click event
   * @private
   */
  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "home") {
      navigate();
    } else {
      // Find the route for the clicked key
      const route = subnavs
        .flatMap((subnav) => subnav.options)
        .find((option) => option.key === key)?.route;
      if (route) {
        navigate(route);
      }
    }
    if (isMobile) {
      onToggle(false);
    }
  };

  /** @const {SidebarTranslation} sidebarData - Translated sidebar content from i18n */
  const sidebarData = t(i18n.language, {
    returnObjects: true,
  }) as SidebarTranslation;

  /** @const {Subnav[]} subnavs - Processed subnavigation items from translation data */
  const subnavs = sidebarData.subnavs;

  /** @const {string} currentPath - Current active route path */
  const currentPath = location.pathname;

  /** @const {string} pathWithoutLang - Current route path without language segment */
  const pathWithoutLang = currentPath.split("/").slice(2).join("/");

  /**
   * Determine current key from URL path
   * This now compares the current path against English routes only
   */
  const currentKey = pathWithoutLang
    ? (subnavs
        .flatMap((subnav) => subnav.options)
        .find((option) => option.route === pathWithoutLang)?.key ?? "home")
    : "home";

  /**
   * Menu items configuration for Ant Design Menu component
   * @type {MenuProps['items']}
   */
  const items: MenuProps["items"] = [
    {
      key: "home",
      icon: React.createElement(HomeOutlined),
      label: sidebarData.home || "Home",
    },
    ...subnavs.map((subnav, index) => {
      const icons = [LaptopOutlined, NotificationOutlined];
      return {
        key: subnav.key,
        icon: React.createElement(icons[index % icons.length]),
        label: subnav.label,
        children: subnav.options.map((option) => ({
          key: option.key,
          label: option.label,
        })),
      };
    }),
  ];

  /**
   * Handles keyboard events for mobile overlay
   * @function handleOverlayKeyDown
   * @param {React.KeyboardEvent} event - Keyboard event
   * @private
   */
  const handleOverlayKeyDown = (event: React.KeyboardEvent) => {
    if (["Enter", " "].includes(event.key)) {
      onToggle(false);
    }
  };

  return (
    <>
      {isMobile && (
        <Button
          icon={<MenuOutlined />}
          onClick={() => {
            onToggle(true);
          }}
          className={`fixed top-4 ${i18n.language === "ar" ? "right-4" : "left-4"} z-1001 transition-opacity ${
            visible ? "opacity-0 invisible" : "opacity-100 visible"
          }`}
        />
      )}

      {isMobile && visible && (
        <div
          role="button"
          tabIndex={0}
          className="fixed inset-0 bg-[#6e6e6e54] bg-opacity-50 z-1000"
          onClick={() => {
            onToggle(false);
          }}
          onKeyDown={handleOverlayKeyDown}
        />
      )}

      <Sider
        width={250}
        style={{
          background: colorBgContainer,
          position: isMobile ? "fixed" : "sticky",
          top: 0,
          height: "100vh",
          zIndex: 1001,
          boxShadow: "2px 0 8px rgba(0,0,0,0.08)",
          borderRight: "1px solid #f0f0f0",
          display: "flex",
          flexDirection: "column",
          padding: "0",
          ...(i18n.language === "ar"
            ? { right: visible ? 0 : -250, transition: "right 0.3s" }
            : { left: visible ? 0 : -250, transition: "left 0.3s" }),
        }}
      >
        {/* Sidebar header with close button */}
        {isMobile && (
          <div
            className={`flex ${i18n.language === "ar" ? "justify-end" : "justify-start"} items-center p-4 border-b border-gray-200`}
            style={{ minHeight: 56 }}
          >
            <Button
              icon={<CloseOutlined />}
              onClick={() => {
                onToggle(false);
              }}
              className="border-none shadow-none"
              style={{ fontSize: 18 }}
            />
          </div>
        )}

        {/* Sidebar menu */}
        <div className="flex-1 flex flex-col justify-start px-2 py-4">
          <Menu
            mode="inline"
            defaultSelectedKeys={["home"]}
            selectedKeys={[currentKey]}
            style={{
              height: "100%",
              borderRight: 0,
              padding: 0,
              background: "transparent",
            }}
            items={items}
            onClick={handleMenuClick}
            className="sidebar-menu"
          />
        </div>
      </Sider>
    </>
  );
};

export default Sidebar;
