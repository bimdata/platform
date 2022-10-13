/* eslint-disable */
import { defineConfig } from "vite";
import replace from "@rollup/plugin-replace";
import env from "vite-plugin-environment";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ mode }) => {
  let config = {
    plugins: [
      replace({
        "@bimdata/design-system/dist/js/BIMDataSmartComponents":
          "@bimdata/design-system/dist/js/BIMDataSmartComponents/vue3",
        delimiters: ["", ""],
        preventAssignment: true
      }),
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
  };
  if (mode !== "production") {
    config.plugins.push(
      env("all", { prefix: "VUE_APP_", defineOn: "process.env" })
    );
  }
  return config;
});
