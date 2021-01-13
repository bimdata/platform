import { createApp } from 'vue';
import vueClickAway from 'vue3-click-away';
import i18n from './i18n';
import router from './router';

import App from './App.vue';

createApp(App)
  .use(vueClickAway)
  .use(i18n)
  .use(router)
  .mount('#app');
