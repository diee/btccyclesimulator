
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Esto permite que los archivos se carguen correctamente en https://usuario.github.io/repo/
  base: './',
});
