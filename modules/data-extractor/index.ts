import { defineNuxtModule } from "nuxt/kit";
import { runDataExctractorApi } from "./data-extractor-api";
import { runDataExctractorXls } from "./data-extractor-xls";

export default defineNuxtModule({
  meta: {
    name: "dataExtractor",
  },
  setup(options, nuxt) {
    // const config = useRuntimeConfig();
    nuxt.hook("build:before", async () => {
      switch (process.env.DATA_EXTRACTOR) {
        case "xls":
          await runDataExctractorXls();
          break;

        case "api":
          await runDataExctractorApi();
          break;
      }
    });
  },
});
