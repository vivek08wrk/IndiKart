import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      external: ['firebase/firestore'], // Externalize Firebase
    },
  },
});
