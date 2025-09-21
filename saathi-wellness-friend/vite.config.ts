import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Use project base path when running in GitHub Actions (for GitHub Pages)
const isCI = process.env.GITHUB_ACTIONS === 'true'
const repoBase = '/GENAI-V1/'

// https://vitejs.dev/config/
export default defineConfig({
  base: isCI ? repoBase : '/',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
