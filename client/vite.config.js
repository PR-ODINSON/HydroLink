import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables based on mode (development/production)
  const env = loadEnv(mode, process.cwd(), '')

  // Determine backend URL: use proxy in dev, full URL in production
  const isDev = mode === 'development'
  const API_BASE = env.VITE_API_URL // e.g., http://localhost:5000/api in dev, https://your-backend.onrender.com/api in prod

  return {
    plugins: [react(), tailwindcss()],
    build: {
      outDir: 'dist',
      sourcemap: false, // Disable sourcemaps for production
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: ['framer-motion', 'lucide-react'],
            charts: ['recharts']
          }
        }
      },
      chunkSizeWarningLimit: 1000,
      target: 'esnext'
    },
    envPrefix: 'VITE_',
    server: {
      port: 5173,
      host: true,
      proxy: isDev
        ? {
            '/api': {
              target: API_BASE,
              changeOrigin: true,
              secure: false,
              timeout: 60000,
              configure: (proxy) => {
                proxy.on('error', (err) => {
                  console.log('Proxy error:', err)
                })
                proxy.on('proxyReq', (proxyReq, req) => {
                  console.log('Proxy request:', req.method, req.url)
                })
              }
            }
          }
        : undefined
    },
    preview: {
      port: 4173,
      host: true
    },
    define: {
      // Make backend URL available to your frontend code
      'import.meta.env.VITE_API_URL': JSON.stringify(API_BASE)
    }
  }
})
