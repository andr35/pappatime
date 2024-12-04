// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-10-27",

  devtools: { enabled: true },
  modules: ["@nuxt/ui"],

  typescript: {
    strict: true,
    typeCheck: true,
  },

  app: {
    head: {
      title: "Pappatime",
      link: [
        { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
        { rel: "manifest", href: "/manifest.webmanifest" },
      ],
    },
  },

  appConfig: {
    mapboxToken: process.env.MAPBOX_TOKEN,
  },

  runtimeConfig: {
    dataXlsUrl: process.env.DATA_XLS_URL,
  },

  icon: {
    serverBundle: {
      collections: ["heroicons", "mdi"],
    },
  },
});
