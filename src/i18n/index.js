import { createI18n } from "vue-i18n";
import en from "./lang/en.json";
import fr from "./lang/fr.json";

const i18n = createI18n({
  // Disable legacy mode and use composition API instead
  legacy: false,
  // Makes i18n functions ($i18n, $t, $d, ...) available in all components templates
  globalInjection: true,
  // Default & fallback locales
  locale: "fr",
  fallbackLocale: "en",

  messages: {
    en,
    fr
  }
});

export default i18n;
