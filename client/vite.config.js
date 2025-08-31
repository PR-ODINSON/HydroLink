import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables based on mode (development/production)
  const env = loadEnv(mode, process.cwd(), '')

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
      // Optimize for production
      chunkSizeWarningLimit: 1000,
      target: 'esnext'
    },
    // Environment variable prefix for client-side
    envPrefix: 'VITE_',
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