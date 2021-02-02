import { createI18n } from "vue-i18n";
import en from "./lang/en";
import fr from "./lang/fr";

const i18n = createI18n({
  locale: "fr",
  fallbackLocale: "en",
  messages: {
    en,
    fr
  }
});

export default i18n;
