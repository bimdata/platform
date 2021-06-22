/* eslint-disable */
import { createApp } from "vue";
import vueClickAway from "vue3-click-away";
import i18n from "./i18n";
import router from "./router";

import App from "./App.vue";
import globalComponents from "@/components/global-components";

const app = createApp(App)
  .use(vueClickAway)
  .use(i18n)
  .use(router);

for (const [name, component] of Object.entries(globalComponents)) {
  app.component(name, component);
}

app.mount("#app");
