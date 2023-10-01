import { defineNuxtModule, useLogger } from "nuxt/kit";
import { runDataExctractor } from "./data-extractor";

export default defineNuxtModule({
  meta: {
    name: "dataExtractor",
  },
  setup(options, nuxt) {
    // const config = useRuntimeConfig();
    nuxt.hook("build:before", async () => {
      if (!process.env.DATA_XLS_URL) {
        throw Error("Var DATA_XLS_URL not defined!");
      }

      await runDataExctractor(process.env.DATA_XLS_URL);
    });
  },
});
