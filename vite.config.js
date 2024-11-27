/* eslint-disable */
import { defineConfig, searchForWorkspaceRoot } from "vite";
import env from "vite-plugin-environment";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ mode }) => {
  let config = {
    define: {
      __VUE_I18N_FULL_INSTALL__: true,
      __VUE_I18N_LEGACY_API__: false,
      __INTLIFY_PROD_DEVTOOLS__: false,
    },
    plugins: [
      vue()
    ],
    optimizeDeps: {
      exclude: ["@bimdata/bcf-components"]
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
