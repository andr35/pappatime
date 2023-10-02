// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui"],

  typescript: {
    strict: true,
    typeCheck: true,
  },

  app: {
    head: {
      title: "Pappatime",
      link: [{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" }],
    },
  },

  appConfig: {
    mapboxToken: process.env.MAPBOX_TOKEN,
  },

  runtimeConfig: {
    dataXlsUrl: process.env.DATA_XLS_URL,
  },
});
