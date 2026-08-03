import { defineConfig } from 'vite';

export default defineConfig({
    // Local Development Configuration
    server: {
        host: '0.0.0.0', // Allows mobile connection over Wi-Fi
        port: 5173,
    },

    // Pre-bundle Shiki for local dev
    optimizeDeps: {
        include: ['shiki', '@shikijs/vscode-textmate']
    },

    // Production Build Configuration (Fixes Netlify module error)
    build: {
        commonjsOptions: {
            include: [/shiki/, /node_modules/]
        }
    }
});