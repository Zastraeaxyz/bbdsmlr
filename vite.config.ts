import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid()],
  server: {
    proxy: {
      '/v2/api': {
        target: 'https://api-prod.bdsmlr.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
