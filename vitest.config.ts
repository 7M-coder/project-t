import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true, // Allows using `expect` globally
    environment: 'jsdom', // Sets the testing environment to jsdom
    setupFiles: ['src/tests/setup.ts'],
    alias: {
      '@tests': '/src/tests', // Alias for the tests directory
      '@programs': '/src/modules/programs', // Alias for the programs module
      '@auth': '/src/modules/auth', // Alias for the core module
      '@core': '/src/modules/core', // Alias for the core module
      '@': '/src' // Alias for the src directory
    },
    coverage: {
      provider: 'v8', // Use 'v8' for the coverage provider
      reporter: ['text', 'lcov', 'json'], // Output coverage results to the console and save in files
      include: ['src/modules/core/**/*.{ts,tsx}', 'src/tests/**/*.{ts,tsx}'], // Files to include in coverage
      exclude: ['node_modules', 'dist'], // Exclude unnecessary files from coverage
      thresholds: {
        global: {
          statements: 80, // Minimum statements coverage percentage
          branches: 80, // Minimum branches coverage percentage
          functions: 80, // Minimum functions coverage percentage
          lines: 80 // Minimum lines coverage percentage
        }
      }
    }
  }
})
