import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/user': {
        target: "http://127.0.0.1:8001",
        changeOrigin: true
      },
      '/chatroom': {
        target: "http://127.0.0.1:8001",
        changeOrigin: true
      }
    }
  }
})
