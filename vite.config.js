import { defineConfig } from "vite";
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: '/JS-Scribbler',
    plugins: [react()],
    server: {
        port: 3001,
        strictPort: true,
    },
    build: {
        outDir: 'build'
    }
})