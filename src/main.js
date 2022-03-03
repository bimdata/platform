/* eslint-disable */
import { createApp } from "vue";
import BIMDataDesignSystem from "@bimdata/design-system/plugin-vue3.js";
import i18n from "@/i18n/index.js";
import router from "@/router/index.js";
import globalComponents from "@/components/global-components.js";
import ErrorService from "@/services/ErrorService.js";

import App from "./App.vue";


const app = createApp(App)
  .use(i18n)
  .use(router)
  .use(BIMDataDesignSystem());

// Register global components
for (const [name, component] of Object.entries(globalComponents)) {
  app.component(name, component);
}

// Setup global error handler
app.config.errorHandler = error => {
  ErrorService.handleError(error);
};

app.mount("#app");
