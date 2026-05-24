import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Security headers (dev server only — for production use Nginx/Cloudflare)
  server: {
    headers: {
      // Prevent MIME type sniffing
      'X-Content-Type-Options': 'nosniff',
      // Prevent clickjacking
      'X-Frame-Options': 'DENY',
      // Enable XSS filter
      'X-XSS-Protection': '1; mode=block',
      // Referrer policy
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      // Permissions policy
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
  },
})
