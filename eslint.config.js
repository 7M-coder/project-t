import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react'
import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import prettier from 'eslint-plugin-prettier/recommended'
import testingLibrary from 'eslint-plugin-testing-library'
import vitest from 'eslint-plugin-vitest'
import jsdoc from 'eslint-plugin-jsdoc' // Import the jsdoc plugin

export default tseslint.config(
  {
    ignores: ['dist', 'docs/**', 'coverage/**']
  },
  {
    extends: [
      eslint.configs.recommended, // JS rules
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      react.configs.flat.recommended, // React rules
      importPlugin.flatConfigs.recommended, // Import rules
      jsxA11y.flatConfigs.recommended, // Accessibility rules
      prettier // Prettier integration
    ],
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      react,
      jsdoc
    },
    languageOptions: {
      ecmaVersion: 2022,
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname
      },
      globals: globals.browser
    },
    settings: {
      // for eslint-plugin-react to auto detect react version
      react: {
        version: 'detect'
      },
      // for eslint-plugin-import to use import alias
      'import/resolver': {
        typescript: {
          project: './tsconfig.app.json'
        }
      }
    },
    rules: {
      'no-console': 'warn', // Warn about console logs
      'react/button-has-type': 'error', // Enforce button types
      'react/react-in-jsx-scope': 'off', // Disable for React 17+
      'react/prop-types': 'off', // Not needed in TypeScript since we rely on static typing
      ...reactHooks.configs.recommended.rules, // React hooks best practices
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      // JSDoc Rules
      'jsdoc/require-jsdoc': [
        'error',
        {
          contexts: [
            'ClassDeclaration',
            'MethodDefinition',
            'FunctionDeclaration',
            'ArrowFunctionExpression',
            'FunctionExpression'
          ],
          publicOnly: true // Only require for exported entities
        }
      ],
      'jsdoc/require-param': 'off', // @param tags Not needed for TypeScript
      'jsdoc/require-returns': 'error', // Require @returns tags
      'jsdoc/require-description': 'error', // Require a description
      'jsdoc/valid-types': 'error' // Validate JSDoc types
    },
    linterOptions: {
      reportUnusedDisableDirectives: true // Warn about unused eslint-disable comments
    }
  },
  {
    files: ['**/*.{spec,test}.{ts,tsx}', 'src/tests/**'],
    extends: [
      // Basic recommended rules for JavaScript
      eslint.configs.recommended,
      // Basic recommended rules for TypeScript
      tseslint.configs.recommended,
      // Prettier to avoid formatting conflicts
      prettier
    ],
    plugins: {
      'testing-library': testingLibrary,
      vitest
    },
    rules: {
      // Turn off or lower severity of stricter rules
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      'jsdoc/require-jsdoc': 'off', // Disable JSDoc for test files

      // Testing Library & Vitest rules
      'testing-library/await-async-queries': 'error',
      'testing-library/no-await-sync-queries': 'error',
      'testing-library/no-debugging-utils': 'warn',
      'testing-library/no-dom-import': 'off',
      ...vitest.configs.recommended.rules,
      'vitest/max-nested-describe': ['error', { max: 3 }]
    }
  }
)
