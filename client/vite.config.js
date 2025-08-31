import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  // Load env variables based on mode (development/production)
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    build: {
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: ['framer-motion', 'lucide-react'],
            charts: ['recharts']
          }
        }
      }
    },
    server: {
      port: 5173,
      host: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3001',
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
    },
    preview: {
      port: 4173,
      host: true
    }
  }
})
