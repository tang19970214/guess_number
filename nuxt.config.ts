// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  devServer: {
    port: 5303
  },
  modules: ['@unocss/nuxt', 'nuxt-icon', '@vite-pwa/nuxt'],
  css: ['@/assets/index.css'],
  pwa: {
    // your pwa option
  }
})
