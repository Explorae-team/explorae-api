import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Isso proíbe o Vite de olhar para o React da pasta do Expo
    dedupe: ['react', 'react-dom'],
  }
})