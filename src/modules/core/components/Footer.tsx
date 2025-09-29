import React from "react";
import { useTranslation } from "react-i18next";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Footer component containing contact information, quick links, and social media links.
 * @function Footer
 * @returns {React.JSX.Element} The rendered footer component
 * @example
 * // Usage in a page component
 * import React from 'react'
 * import Footer from '@/modules/core/components/Footer'
 *
 * const MyPage = () => {
 *   return (
 *     <div>
 *       <h1>My Page</h1>
 *       <Footer />
 *     </div>
 *   )
 * }
 */
const Footer: React.FC = () => {
  const { t } = useTranslation(["core"]);
  const { i18n } = useTranslation();
  const currentLang = i18n.resolvedLanguage;
  const socialLinks = [
    { icon: Youtube, href: "#", name: "youtube" },
    { icon: Twitter, href: "#", name: "twitter" },
    { icon: Instagram, href: "#", name: "instagram" },
    { icon: Facebook, href: "#", name: "facebook" },
  ];

  const footerItems: { key: string; to: string }[] = [
    { key: "aboutUs", to: `/${currentLang ?? "ar"}/about` },
    { key: "successStories", to: `/${currentLang ?? "ar"}/success-stories` },
    { key: "programs", to: `/${currentLang ?? "ar"}/programs` },
    { key: "news", to: `/${currentLang ?? "ar"}/news` },
    { key: "contactUs", to: `/${currentLang ?? "ar"}/contact` },
  ];

  return (
    <footer className="bg-theme-surface text-primary border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-4 flex flex-col items-center">
            <h4 className="font-bold text-lg mb-4">
              {t("footer.contactInfo")}
            </h4>
            <div className="flex flex-col gap-4">
              <div className="flex justify-center items-center gap-x-2">
                <Phone className="text-accent w-6 h-6" />
                <span>0545530409</span>
              </div>
              <div className="flex justify-center items-center gap-x-2">
                <Mail className="text-accent w-6 h-6" />
                <span>safealgo@gmail.com</span>
              </div>
              <div className="flex justify-center items-center gap-x-2">
                <MapPin className="text-accent w-6 h-6" />
                <span>{t("footer.address")}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 flex flex-col items-center">
            <h4 className="font-bold text-lg mb-4">{t("footer.quickLinks")}</h4>
            <ul className="flex flex-col items-center gap-4">
              {footerItems.map((item) => (
                <li key={item.key}>
                  <Link
                    to={item.to}
                    className="hover:text-accent transition-colors"
                  >
                    {t(`footer.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className=" flex flex-col items-center">
            <h4 className="font-bold text-lg mb-4">
              {t("footer.socialMedia")}
            </h4>
            <div className="flex flex-col gap-4">
              {socialLinks.map(({ icon: Icon, href, name }, index) => (
                <a
                  key={index}
                  href={href}
                  className="text-secondary hover:text-accent flex justify-center gap-2"
                >
                  <h1>{t(`footer.socialMediaApps.${name}`)}</h1>
                  <Icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8 text-sm text-secondary">
          © 2025 {t("footer.copyrightText")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
