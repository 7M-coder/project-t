import { useEffect } from "react";
import { useTranslation } from "react-i18next";

/**
 * useLocalizeDocumentAttributes Hook
 *
 * A custom hook that updates the `lang` and `dir` attributes of the HTML document
 * based on the current language selected in the i18n instance.
 *
 * Ensures that the document's language and text direction are correctly set,
 * supporting both left-to-right (LTR) and right-to-left (RTL) languages.
 *
 * @returns {void} This hook does not return any value.
 */
export default function useLocalizeDocumentAttributes(): void {
  const { i18n } = useTranslation();

  useEffect(() => {
    try {
      const storedLang = localStorage.getItem("i18nLang");
      // Set the initial language to 'ar' instead of 'en'
      document.documentElement.lang = storedLang ?? "ar";
      document.documentElement.dir = storedLang == "ar" ? "rtl" : "ltr";

      if (i18n.resolvedLanguage) {
        // Set the <html lang> attribute.
        document.documentElement.lang = storedLang ?? i18n.resolvedLanguage;

        // Set the <html dir> attribute.
        document.documentElement.dir = i18n.dir(
          storedLang ?? i18n.resolvedLanguage
        );
      }
    } catch (error) {
      console.error(error);
    }
  }, [i18n, i18n.resolvedLanguage]);
}
