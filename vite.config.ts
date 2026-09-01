import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import { VitePWA } from 'vite-plugin-pwa'
import { viteSingleFile } from 'vite-plugin-singlefile'

const pwaPlugin = VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['icon.svg'],
  manifest: {
    name: '中华恐龙考察队',
    short_name: '恐龙考察队',
    description: '面向六岁儿童的无广告益智小游戏',
    theme_color: '#123d36',
    background_color: '#f7f1df',
    display: 'standalone',
    orientation: 'any',
    lang: 'zh-CN',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any maskable'
      }
    ]
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,svg,woff2,mp3}'],
    navigateFallback: '/index.html',
    maximumFileSizeToCacheInBytes: 3_000_000
  }
})

export default defineConfig(({ mode }) => {
  const portable = mode === 'portable'

  return {
    base: portable ? './' : '/',
    plugins: [
      react(),
      portable
        ? viteSingleFile({ removeViteModuleLoader: true })
        : pwaPlugin
    ],
    server: {
      host: '0.0.0.0'
    },
    preview: {
      host: '0.0.0.0'
    },
    build: {
      outDir: portable ? 'portable' : 'dist',
      chunkSizeWarningLimit: portable ? 3000 : 1600
    },
    test: {
      environment: 'jsdom',
      setupFiles: './src/test-setup.ts',
      css: true
    }
  }
})
