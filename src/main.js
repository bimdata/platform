/* eslint-disable */
import { createApp } from "vue";
import BcfComponents from "@bimdata/bcf-components/vue3-plugin.js";
import BIMDataComponents from "@bimdata/components/vue3-plugin.js";
import BIMDataDesignSystem from "@bimdata/design-system/vue3-plugin.js";
import BuildingMaker from "@bimdata/building-maker/vue3-plugin.js";
import BIMDataGuidedTourComponents from "@bimdata/guided-tour-components/vue-plugin.js";
import i18n from "./i18n/index.js";
import router from "./router/index.js";
import globalComponents from "./components/global-components.js";
import apiClient from "./services/api-client.js";
import ErrorService from "./services/ErrorService.js";

import App from "./App.vue";


const app = createApp(App)
  .use(i18n)
  .use(router)
  .use(BIMDataDesignSystem())
  .use(BIMDataComponents())
  .use(BIMDataGuidedTourComponents())
  .use(BcfComponents({ apiClient, i18nPlugin: i18n }))
  .use(BuildingMaker({ i18nPlugin: i18n }));

// Register global components
for (const [name, component] of Object.entries(globalComponents)) {
  app.component(name, component);
}

// Setup global error handler
app.config.errorHandler = error => {
  ErrorService.handleError(error);
};

app.mount("#app");
