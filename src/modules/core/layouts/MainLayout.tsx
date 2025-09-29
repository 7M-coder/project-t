import { ReactNode, useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Layout, theme, Dropdown } from "antd";
import { UserOutlined, MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SignOutButton from "@/modules/auth/components/SignOutButton";
import ThemeToggle from "../components/ThemeToggle";
import Button from "../components/Button";
import LanguageSwitcher from "../components/LanguageSwitcher";

const { Header, Content } = Layout;

interface User {
  display_name: string;
}

/**
 * Props for the MainLayout component
 * @interface MainLayoutProps
 * @property {ReactNode} [children] - Child components to render within the layout
 */
interface MainLayoutProps {
  children?: ReactNode;
}

/**
 * Main application layout component with responsive sidebar and content area
 * @component
 * @param {MainLayoutProps} props - Component properties
 * @param {ReactNode} [props.children] - Child components to render in content area
 * @returns {React.JSX.Element} - Full page layout structure with responsive behavior
 */
function MainLayout({ children }: MainLayoutProps): React.JSX.Element {
  const { t, i18n } = useTranslation("core");
  /** @const {boolean} isMobile - Tracks if viewport is mobile size (<=768px) */
  const [isMobile, setIsMobile] = useState(false);

  /** @const {boolean} sidebarVisible - Controls sidebar visibility state */
  const [sidebarVisible, setSidebarVisible] = useState(true);

  // New state for user info with type definition
  const [user, setUser] = useState<User | null>(null);

  // Read the user info from localStorage on mount.
  useEffect(() => {
    const storedUser = localStorage.getItem("USER_INFO");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser) as User);
      } catch (error) {
        console.error("Error parsing user info:", error);
      }
    }
  }, []);

  // Access theme design tokens
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Build the profile dropdown menu items.
  const profileMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: <Link to="/profile">{t("profile")}</Link>,
    },
    {
      key: "logout",
      label: <SignOutButton />,
    },
  ];

  /**
   * Handles viewport resize events and maintains responsive state
   * @effect
   */
  useEffect(() => {
    /** Checks viewport width and updates responsive states */
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      // Automatically show/hide sidebar based on viewport
      setSidebarVisible(window.innerWidth > 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar with transition */}
      <div
        style={{
          transition: "width 0.3s, opacity 0.3s",
          width: sidebarVisible ? 240 : 0,
          opacity: sidebarVisible ? 1 : 0,
          overflow: "hidden",
        }}
      >
        {sidebarVisible && (
          <Sidebar
            visible={sidebarVisible}
            onToggle={(visible: boolean) => {
              setSidebarVisible(visible);
            }}
            isMobile={isMobile}
          />
        )}
      </div>

      <Layout>
        {/* Header section */}
        <Header
          style={{
            padding: "0 16px",
            width: "100%",
            background: colorBgContainer,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Sidebar toggle - placed at the start of the header */}
          <span
            onClick={() => setSidebarVisible(!sidebarVisible)}
            aria-label={sidebarVisible ? "Close sidebar" : "Open sidebar"}
            className="mr-2 cursor-pointer flex items-center"
            style={{ fontSize: 20 }}
          >
            {sidebarVisible ? <CloseOutlined /> : <MenuOutlined />}
          </span>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <LanguageSwitcher />
            <Dropdown
              menu={{ items: profileMenuItems }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <span tabIndex={0} style={{ display: "inline-block" }}>
                <Button
                  buttonType="default"
                  buttonText=""
                  icon={<UserOutlined />}
                />
              </span>
            </Dropdown>
            {/* Display the user's nickname or a default if not available */}
            <span className="text-sm font-medium text-primary">
              {user?.name ?? t("guest")}
            </span>
          </div>
        </Header>

        {/**
         * Main content area with responsive margins
         * @memberof MainLayout
         */}
        <Content
          style={{
            margin: isMobile ? "16px 8px" : "16px 16px",
            transition: "margin 0.3s",
          }}
        >
          {/**
           * Content container with consistent styling
           * @memberof MainLayout
           */}
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              height: "100%",
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default MainLayout;
