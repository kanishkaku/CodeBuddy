import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    open: true,
    allowedHosts: [
      'forgemycode-production.up.railway.app',
      'localhost',
      'forgemycode.com'
    ]
  },
})
