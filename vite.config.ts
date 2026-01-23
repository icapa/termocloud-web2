import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  define: {
    '__APP_VERSION__': JSON.stringify(process.env.npm_package_version),
  },
})

