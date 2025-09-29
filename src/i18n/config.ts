import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

export const supportedLngs = {
  en: 'English',
  ar: 'Arabic'
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
i18n
  // Add plugins.
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(Backend)
  // Initialize the i18next instance.
  .init({
    // Config options

    // Specifies the default language (locale) used
    // when a user visits our site for the first time.
    // We use English here, but feel free to use
    // whichever locale you want.
    // lng: 'ar',

    // Fallback locale used when a translation is
    // missing in the active locale. Again, use your
    // preferred locale here.
    fallbackLng: 'ar',

    // Explicitly tell i18next our
    // supported locales.
    supportedLngs: Object.keys(supportedLngs),

    // Enables useful output in the browser’s
    // dev console.
    debug: true,

    // Normally, we want `escapeValue: true` as it
    // ensures that i18next escapes any code in
    // translation messages, safeguarding against
    // XSS (cross-site scripting) attacks. However,
    // React does this escaping itself, so we turn
    // it off in i18next.
    interpolation: {
      escapeValue: false
    },

    // Set 'common' as the default namespace for translations,
    // and tell i18next the additional namespaces we use.
    defaultNS: 'common',
    ns: ['common', 'core', 'auth', 'programs', 'sidebar']
  })

export default i18n
