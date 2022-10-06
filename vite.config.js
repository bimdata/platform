import { defineConfig } from "vite";
import replace from "@rollup/plugin-replace";
import env from "vite-plugin-environment";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    replace({
      "@bimdata/design-system/dist/js/BIMDataSmartComponents":
        "@bimdata/design-system/dist/js/BIMDataSmartComponents/vue3",
      delimiters: ["", ""],
      preventAssignment: true
    }),
    env("all", { prefix: "VUE_APP_", defineOn: "import.meta.env" }),
    vue()
  ],
  css: {
    preprocessorOptions: {
      scss: {
        // Make global SASS mixins available everywhere
        additionalData: '@import "/src/styles/mixins.scss";'
      }
    }
  },
  server: {
    port: 8080
  }
});
