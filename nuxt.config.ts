// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui"],

  typescript: {
    strict: true,
    typeCheck: true,
  },

  appConfig: {
    mapboxToken: process.env.MAPBOX_TOKEN,
  },

  runtimeConfig: {
    dataXlsUrl: process.env.DATA_XLS_URL,
  },
});
