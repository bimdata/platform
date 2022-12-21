/* eslint-disable */
import { defineConfig } from "vite";
import env from "vite-plugin-environment";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ mode }) => {
  let config = {
    plugins: [
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
      env("all", { prefix: "VUE_APP_", defineOn: "ENV" })
    );
  }

  return config;
});
