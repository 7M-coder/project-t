// lint-staged.config.js

export default {
  '**/*.{ts,tsx,js,jsx}': (stagedFiles) => [
    `eslint --fix ${stagedFiles.join(' ')}`, // Lint and auto-fix JavaScript and TypeScript files
    `eslint .`, // Lint without fixing to catch remaining errors
    `prettier --write ${stagedFiles.join(' ')}` // Format JavaScript and TypeScript files
  ],
  '**/*.{cjs,css,md,json}': (stagedFiles) => [
    `prettier --write ${stagedFiles.join(' ')}` // Only format other file types
  ]
}
