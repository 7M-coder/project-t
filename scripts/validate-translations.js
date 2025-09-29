import fs from 'fs'
import path from 'path'

// Correct path to the translations directory
const localesPath = path.resolve('public/locales') // Adjusted to point to 'public/locales'
const supportedLanguages = ['en', 'ar'] // Supported languages
const defaultLanguage = 'en' // Default language
const namespaces = ['common', 'core', 'auth', 'programs'] // Namespaces used in the application

/**
 * Validates translations for supported languages.
 */
function validateTranslations() {
  let isValid = true

  supportedLanguages.forEach((language) => {
    namespaces.forEach((namespace) => {
      const filePath = path.join(localesPath, language, `${namespace}.json`)

      if (!fs.existsSync(filePath)) {
        console.error(`❌ Missing translation file: ${filePath}`)
        isValid = false
        return
      }

      const translations = JSON.parse(fs.readFileSync(filePath, 'utf8'))
      const defaultFilePath = path.join(localesPath, defaultLanguage, `${namespace}.json`)
      const defaultTranslations = JSON.parse(fs.readFileSync(defaultFilePath, 'utf8'))

      // Check for missing keys
      const missingKeys = Object.keys(defaultTranslations).filter((key) => !(key in translations))

      if (missingKeys.length > 0) {
        console.error(`❌ Missing keys in ${language}/${namespace}:`, missingKeys)
        isValid = false
      }

      // Check for extra keys
      const extraKeys = Object.keys(translations).filter((key) => !(key in defaultTranslations))

      if (extraKeys.length > 0) {
        console.warn(`⚠️ Extra keys in ${language}/${namespace}:`, extraKeys)
      }
    })
  })

  if (isValid) {
    console.log('✅ All translations are valid!')
    process.exit(0)
  } else {
    console.error('❌ Translation validation failed.')
    process.exit(1)
  }
}

validateTranslations()
