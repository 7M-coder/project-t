import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "./Button";
import { AlignJustify, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";

/**
 * A responsive navigation bar component with internationalization support and mobile-friendly behavior
 * @component
 * @param {object} props - Component properties
 * @returns {React.JSX.Element}
 * @example
 * // Basic usage
 * <Navbar />
 */
const Navbar = () => {
  const { t } = useTranslation(["core"]);
  const { i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentLang = i18n.resolvedLanguage;
  const navItems: { key: string; to: string }[] = [
    { key: "aboutUs", to: `/${currentLang ?? "ar"}/about` },
    { key: "successStories", to: `/${currentLang ?? "ar"}/success-stories` },
    { key: "programs", to: `/${currentLang ?? "ar"}/programs` },
    { key: "news", to: `/${currentLang ?? "ar"}/news` },
    { key: "contactUs", to: `/${currentLang ?? "ar"}/contact` },
  ];

  return (
    <nav className="bg-theme-surface shadow-xs p-0 mb-0 border-b border-theme-border text-primary flex justify-center">
      <div className="w-11/12 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="shrink-0">
            <img src="/logo.svg" alt="logo" className="w-36 h-36" />
          </div>

          {/* Main Navigation */}
          <div className="hidden lg:flex items-center gap-x-8">
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.to}
                className="text-primary hover:text-accent"
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-x-4">
            <Link to={"/ar/login"}>
              <Button buttonType="primary" buttonText={t("nav.login")} />
            </Link>
            <Link to={"/ar/register"}>
              <Button buttonType="default" buttonText={t("nav.register")} />
            </Link>
            <ThemeToggle />
            <LanguageSwitcher />
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="p-2 rounded-md text-primary hover:text-accent"
            >
              {isMobileMenuOpen ? <X /> : <AlignJustify />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ${isMobileMenuOpen ? "block" : "hidden"}`}
        >
          <div className="px-2 py-2 pb-3 space-y-1">
            {/* Main Nav Links */}
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.to}
                className="block px-3 py-2 text-primary hover:text-accent"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                }} // Close menu on click
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}

            {/* Auth Links (Login & Register) */}
            <Link
              to="/ar/login"
              className="block px-3 py-2 text-primary text-primary hover:text-accent hover:border-accent"
              onClick={() => {
                setIsMobileMenuOpen(false);
              }}
            >
              {t("nav.login")}
            </Link>

            <Link
              to="/ar/register"
              className="block px-3 py-2 text-primary text-primary hover:text-accent hover:border-accent"
              onClick={() => {
                setIsMobileMenuOpen(false);
              }}
            >
              {t("nav.register")}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
