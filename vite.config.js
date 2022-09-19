import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
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
