import { defineConfig } from "vite";
import env from "vite-plugin-environment";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
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
