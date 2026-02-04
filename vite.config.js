import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// [https://vitejs.dev/config/](https://vitejs.dev/config/)
export default defineConfig({
  plugins: [react()],
  base: '/mockup-join-org/', // ต้องตรงกับชื่อ Repo ที่ตั้งใน GitHub
})