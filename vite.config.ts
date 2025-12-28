import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['three']  // threeの重複を防ぐ
  },
  optimizeDeps: {
    exclude: ['opencover-3d']  // 開発中はpre-bundleから除外
  }
})
