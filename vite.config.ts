
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Esto permite que process.env.API_KEY funcione en el navegador usando las variables de entorno de Vercel
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  },
});
