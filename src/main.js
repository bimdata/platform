/* eslint-disable */
import { createApp } from "vue";
import BcfComponents from "@bimdata/bcf-components/vue3-plugin.js";
import BIMDataComponents from "@bimdata/components/vue3-plugin.js";
import DesignSystem from "@bimdata/design-system/vue3-plugin.js";
import i18n from "./i18n/index.js";
import router from "./router/index.js";
import globalComponents from "./components/global-components.js";
import apiClient from "./services/api-client.js";
import ErrorService from "./services/ErrorService.js";

import App from "./App.vue";


const app = createApp(App)
  .use(i18n)
  .use(router)
  .use(DesignSystem())
  .use(BIMDataComponents({ i18nPlugin: i18n }))
  .use(BcfComponents({ i18nPlugin: i18n, apiClient }));

// Register global components
for (const [name, component] of Object.entries(globalComponents)) {
  app.component(name, component);
}

// Setup global error handler
app.config.errorHandler = error => {
  ErrorService.handleError(error);
};

app.mount("#app");
