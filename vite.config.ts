import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    base: '/shooting-game',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    }
})
