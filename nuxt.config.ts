// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  devServer: {
    port: 5303
  },
  modules: [ '@unocss/nuxt', 'nuxt-icon' ],
  css: ['@/assets/index.css']
})
