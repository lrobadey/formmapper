import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/formmapper/', // Required for GitHub Pages deployment
  server: {
    open: true, // Auto-open browser when dev server starts
  },
})
