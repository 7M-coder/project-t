/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(), // Enables React support
    tsconfigPaths(), // Resolves path aliases from tsconfig.json
    tailwindcss() // Enables Tailwind CSS support
  ],
  server: {
    host: '0.0.0.0', // Allows external access (useful for Docker or LAN testing)
    port: 3000, // Default port for the dev server
    strictPort: true, // Fail if the port is already in use
    open: false // Automatically open the browser
  },
  preview: {
    port: 5000 // Port for previewing the production build
  },
  build: {
    outDir: 'dist', // Output directory for the production build
    sourcemap: true // Generate source maps for debugging
  },
  resolve: {
    alias: {
      '@': '/src', // Root alias
      '@assets': '/src/assets',
      '@core': '/src/modules/core',
      '@auth': '/src/modules/auth',
      '@programs': '/src/modules/programs'
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'] // Pre-bundle these dependencies for faster startup
  }
})
