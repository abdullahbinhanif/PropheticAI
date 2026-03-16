import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // এটি যোগ করলে কিছু পুরনো লাইব্রেরি যারা 'process.env' খোঁজে তাদের এরর দূর হবে
    'process.env': {}
  },
  server: {
    port: 5173, // Vite এর ডিফল্ট পোর্ট
    proxy: {
      // ব্যাকএন্ডের সাথে সহজে কানেক্ট করার জন্য প্রক্সি
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})