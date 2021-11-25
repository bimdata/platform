import { createI18n } from "vue-i18n";
import datetimeFormats from "./datetime.js";
import de from "./lang/de.json";
import en from "./lang/en.json";
import es from "./lang/es.json";
import fr from "./lang/fr.json";
import it from "./lang/it.json";

const i18n = createI18n({
  // Disable legacy mode and use composition API instead
  legacy: false,
  // Makes i18n functions ($i18n, $t, $d, ...) available in all components templates
  globalInjection: true,
  // Set default locale according to navigator language
  locale: navigator.language.slice(0, 2),
  // Fallback to english if no translation available
  fallbackLocale: "en",

  // Date & Time formatting for each locale
  datetimeFormats,

  messages: {
    de,
    en,
    es,
    fr,
    it
  }
});

export default i18n;
