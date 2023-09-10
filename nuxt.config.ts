// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  devServer: {
    port: 5303
  },
  app: {
    head: {
      link: [
        { rel: 'manifest', href: '/manifest.webmanifest' }
      ]
    }
  },
  modules: ['@unocss/nuxt', 'nuxt-icon', '@vite-pwa/nuxt'],
  css: ['@/assets/index.css'],
  pwa: {
    strategies: 'generateSW',
    registerType: 'autoUpdate',
    manifest: {
      name: '猜數字(1A2B)',
      short_name: '猜數字(1A2B)',
      theme_color: '#F29600',
      description: "基於Nuxt3+Typescript開發的簡易小遊戲。",
      display: "fullscreen",
      icons: [
        {
          src: '/images/pwa_192*192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/images/pwa_512*512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/images/pwa_512*512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
      start_url: "/"
    },
    workbox: {
      navigateFallback: null,
      globPatterns: ['*/**.{js,css,html,png,svg,ico}'],
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [
        {
          urlPattern: /.*\/api/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'interface-cache',
            backgroundSync: {
              name: "backgroundSync-interface",
            },
            cacheableResponse: {
              statuses: [200]
            },
            networkTimeoutSeconds: 10,
          },
        },
        {
          urlPattern: /(.+)\.(png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps|ico)/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'image-cache',
            cacheableResponse: {
              statuses: [200]
            },
          },
        },
        {
          urlPattern: /.*\.(css|less|scss)/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'css-cache',
            fetchOptions: {
              headers: [
                ['Content-Type', 'text/javascript']
              ]
            },
          },
        },
        {
          urlPattern: /.*\.(js|ts|vue|ts|mjs)/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'js-cache',
          },
        },
        {
          urlPattern: /\/(detail|write-article|archive|label|friend-link|message-board|about-my|announcement|person|creator-center)?/, //  页面缓存
          handler: 'NetworkFirst',
          options: {
            cacheName: 'pages-cache',
            networkTimeoutSeconds: 10,
          },
        },
      ],
    },
    selfDestroying: false,
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
  },
})