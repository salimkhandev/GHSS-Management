import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('recharts') || id.includes('d3')) return 'charts';
            if (id.includes('@mui')) return 'mui';
            if (id.includes('react-dom')) return 'react-dom';
            if (id.includes('react')) return 'react';
            return 'vendor';
          }
        }
      }
    }
  }
})
  