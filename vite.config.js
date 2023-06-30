/* eslint-disable */
import { defineConfig, searchForWorkspaceRoot } from "vite";
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
      port: 8080,
      fs: {
        allow: [
          // Allow to load design system fonts in dev mode
          searchForWorkspaceRoot(process.cwd()),
          "../design-system/src/assets/fonts"
        ]
      }
    }
  };

  if (mode !== "production") {
    config.plugins.push(
      env("all", { prefix: "VUE_APP_", defineOn: "ENV" })
    );
  }

  return config;
});
