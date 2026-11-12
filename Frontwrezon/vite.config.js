import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const isCapacitor = process.env.CAP_BUILD === 'true';

    return {
        // 👈 REQUIRED for Capacitor: relative asset paths
        base: './',

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
            // 👇 OLD PWA PLUGIN (commented out — breaks Capacitor WebView)
            // VitePWA({
            //     strategies: 'injectManifest',
            //     srcDir: 'public',
            //     filename: 'sw.js',
            //     manifest: false,
            //     injectManifest: {
            //         maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
            //         globPatterns: ['**/*.{js,css,html,ico,png,svg,json,wasm}']
            //     }
            // })

            // 👇 NEW: PWA only for web builds, skipped for Capacitor
            !isCapacitor && VitePWA({
                strategies: 'injectManifest',
                srcDir: 'public',
                filename: 'sw.js',
                manifest: false,
                injectManifest: {
                    maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
                    globPatterns: ['**/*.{js,css,html,ico,png,svg,json,wasm}']
                }
            })
        ].filter(Boolean)
    };
});