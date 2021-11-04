/* eslint-disable */
import { createApp } from "vue";
import vueClickAway from "vue3-click-away";
import i18n from "@/i18n";
import router from "@/router/index.js";
import ErrorService from "@/services/ErrorService";

import App from "./App.vue";
import globalComponents from "@/components/global-components";

const app = createApp(App)
  .use(vueClickAway)
  .use(i18n)
  .use(router);

// Register global components
for (const [name, component] of Object.entries(globalComponents)) {
  app.component(name, component);
}

// Setup global error handler
app.config.errorHandler = error => {
  ErrorService.handleError(error);
};

app.mount("#app");
