import { fileURLToPath, URL } from 'node:url';

import { defineConfig, splitVendorChunkPlugin } from 'vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import vue from '@vitejs/plugin-vue';
import fg from 'fast-glob';

import copy from 'rollup-plugin-copy';

// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    build: {
        sourcemap: false,
        minify: false,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return id.toString().split('node_modules/')[1].split('/')[0].toString();
                    }
                },
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: (assetInfo) => {
                    let extType = assetInfo.name.split('.').at(1);
                    if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
                        extType = 'img';
                    }
                    return `assets/${extType}/[name]-[hash][extname]`;
                }
            },
            plugins: [
                copy({
                    targets: [
                        {
                            src: 'bin/mac/*',
                            dest: 'dist/build-mac/modules/exif-inspector/'
                        }
                    ],
                    hook: 'closeBundle'
                })
            ]
        }
    },
    plugins: [
        splitVendorChunkPlugin(),
        vue(),
        AutoImport({
            imports: ['vue'],
            resolvers: [ElementPlusResolver()]
        }),
        Components({
            dirs: ['src/components/**', 'src/views/**'],
            resolvers: [ElementPlusResolver()]
        }),
        {
            name: 'watch-external',
            async buildStart() {
                const files = await fg(['public/**']);
                for (let file of files) {
                    this.addWatchFile(file);
                }
            }
        }
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@styles': fileURLToPath(new URL('./src/assets/styles', import.meta.url)),
            '@scripts': fileURLToPath(new URL('./src/assets/scripts', import.meta.url))
        }
    }
});
