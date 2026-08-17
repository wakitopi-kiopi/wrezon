import { defineConfig } from 'vite';

import { VitePWA } from 'vite-plugin-pwa';



export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 5173,
    },
    optimizeDeps: {
        include: ['shiki', '@shikijs/vscode-textmate']
    },
    build: {
        target: 'esnext', // Support modern top-level await and dynamic imports
        rollupOptions: {
            input: {
                main: 'index.html',
                
            }
        }
    },

    plugins: [
        VitePWA({
            strategies: 'injectManifest', // 👈 Keeps  custom Service Worker
            srcDir: 'public',             // 👈 Where  sw.js currently lives
            filename: 'sw.js',            // 👈  existing Service Worker file name
            manifest: false,              // 👈 Uses  existing manifest file
            injectManifest: {
                // Allows large Shiki WASM/JSON assets without build errors
                maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
                globPatterns: ['**/*.{js,css,html,ico,png,svg,json,wasm}']
            }
        })
    ]
});