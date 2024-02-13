// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  plugins: ["~/services/echo.js"],
  modules: [
    "@element-plus/nuxt",
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", "acceptHMRUpdate"],
      },
    ],
  ],
  alias: {
    pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs",
  },
  imports: {
    dirs: ["stores"],
  },
  runtimeConfig: {
    public: {
      NUXT_PUBLIC_API_BASE: process.env.NUXT_API_BASE_URL,
      PUSHER_APP_KEY: process.env.PUSHER_APP_KEY,
      PUSHER_APP_CLUSTER: process.env.PUSHER_APP_CLUSTER,
      PUSHER_HOST: process.env.PUSHER_HOST,
      PUSHER_PORT: process.env.PUSHER_PORT,
      PUSHER_TLS: process.env.PUSHER_TLS,
    },
  },
  routeRules: {
    "api/**": {
      proxy: { to: "http://127.0.0.1:3000/api**" },
    },
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
});
