
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Aseguramos que las variables siempre tengan un valor de cadena para evitar errores de referencia en el navegador
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ""),
    'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL || ""),
    'process.env.SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY || ""),
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
