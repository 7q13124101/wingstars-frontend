import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Lấy các biến môi trường từ file .env
  const env = loadEnv(mode, process.cwd(), '');
  
  // Đọc link từ file .env, nếu không có thì mặc định về localhost
  const targetUrl = env.VITE_API_PROXY_TARGET || 'https://hypermiraculous-uncontumaciously-melonie.ngrok-free.dev';

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        // Bắt tất cả các link bắt đầu bằng /api
        '/api': {
          target: targetUrl,
          changeOrigin: true,
          secure: false,
          headers: {
            'ngrok-skip-browser-warning': 'true',
          }
        },
        // Nếu có load ảnh từ /uploads thì thêm luôn cái này
        '/uploads': {
          target: targetUrl,
          changeOrigin: true,
          secure: false,
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        }
      }
    }
  }
})