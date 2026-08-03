import { defineConfig } from 'vite';

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
            output: {
                // Force vendor dependencies like Shiki into a single bundle chunk
                manualChunks(id) {
                    if (id.includes('shiki') || id.includes('@shikijs')) {
                        return 'shiki-vendor';
                    }
                }
            }
        }
    }
});