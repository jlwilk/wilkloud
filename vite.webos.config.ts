import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import legacy from '@vitejs/plugin-legacy'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  base: './', // ✅ webOS needs relative paths
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    tailwindcss(),
    legacy({
      // ✅ Remove modern legacy split logic that breaks webOS
      targets: ['Chrome 53'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      modernPolyfills: false,
      renderLegacyChunks: false, // ✅ Don't inject <script type="module"> feature detection
      polyfills: [
        'es.symbol',
        'es.promise',
        'es.array.iterator',
        'es.object.assign',
        'es.object.entries',
        'es.object.from-entries',
        'web.dom-collections.for-each'
      ]
    }),
    viteStaticCopy({
      targets: [
        { src: 'appinfo.json', dest: '.' },
        { src: 'icon.png', dest: '.' }
      ]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url))
    }
  },
  server: {
    host: true,
    port: 5173
  },
  build: {
    target: 'es2015',
    outDir: 'dist-webos'
  }
})
