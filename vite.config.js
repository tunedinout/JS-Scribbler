import { defineConfig } from "vite";
import react from '@vitejs/plugin-react'
import {resolve} from "path"
// 
export default defineConfig({
    base: '/JS-Scribbler/',
    plugins: [react()],
    server: {
        port: 3001,
        strictPort: true,
    },
    build: {
        outDir: 'build'
    },
    resolve: {
        alias: {
            '@src': resolve(import.meta.dirname, 'src'),
            '@auth': resolve(import.meta.dirname, 'src/auth'),
            '@components': resolve(import.meta.dirname, 'src/components'),
            '@core-components': resolve(import.meta.dirname, 'src/core-components'),
            '@hooks': resolve(import.meta.dirname, 'src/hooks'),
            '@workers': resolve(import.meta.dirname, 'src/workers'),
            '@pages': resolve(import.meta.dirname, 'src/pages'),
            '@constants': resolve(import.meta.dirname, 'src/constants.js')
        }
    }
})