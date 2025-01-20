import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8080", // 백엔드 서버 URL
        changeOrigin: true, // 대상 서버의 CORS 정책 우회
        // rewrite: (path) => path.replace(/^\/api/, ""), // '/api'를 제거
      },
    },
  },

});
