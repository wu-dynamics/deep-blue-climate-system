export default defineNuxtConfig({
  compatibilityDate: '2025-08-03',
  devtools: { enabled: false },
  ssr: false,

  app: {
    head: {
      title: '深蓝气候终端',
      htmlAttrs: { lang: 'zh-CN' },
    },
  },

  devServer: {
    port: 8708,
  },

  modules: [
    '@nuxt/ui-pro',
    '@vueuse/nuxt',
  ],

  css: ['~/app.css'],

  fonts: {
    providers: {
      google: false,
      googleicons: false,
    },
  },
});
