module.exports = {
  input: ['src/**/*.{js,jsx,ts,tsx}'], // Paths to scan for translation keys
  output: './locales/$LOCALE/$NAMESPACE.json', // Specify the output path for generated keys
  options: {
    removeUnusedKeys: true, // Remove keys that are no longer used in the source code
    sort: true, // Sort keys alphabetically
    lngs: ['en', 'ar'], // Supported languages
    defaultLng: 'ar', // Default language
    ns: ['common', 'core', 'auth', 'programs', 'sidebar'], // Namespaces to use
    defaultNs: 'common', // Default namespace for keys without explicit namespace
    resource: {
      loadPath: './locales/{{lng}}/{{ns}}.json', // Path to existing translation files
      savePath: './locales/{{lng}}/{{ns}}.json' // Path to save updated files
    },
    nsSeparator: ':', // Separator for namespaces in translation keys
    keySeparator: '.', // Separator for nested keys
    interpolation: {
      prefix: '{{',
      suffix: '}}'
    }
  }
}
