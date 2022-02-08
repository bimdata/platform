/* eslint-disable */
import { createApp } from "vue";
import { BIMDataClickAway } from "@bimdata/design-system/dist/js/BIMDataDirectives/vue3/index.js";
import i18n from "@/i18n/index.js";
import router from "@/router/index.js";
import globalComponents from "@/components/global-components.js";
import ErrorService from "@/services/ErrorService.js";

import App from "./App.vue";


const app = createApp(App)
  .use(i18n)
  .use(router);

// Register global components
for (const [name, component] of Object.entries(globalComponents)) {
  app.component(name, component);
}

app.directive('clickAway', BIMDataClickAway)

// Setup global error handler
app.config.errorHandler = error => {
  ErrorService.handleError(error);
};

app.mount("#app");
