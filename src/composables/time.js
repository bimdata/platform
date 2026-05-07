import { useI18n } from "vue-i18n";

export function useTimeAgo() {
  const { t } = useI18n();

  const formatTimeAgo = (dateObj) => {
    const diff = Math.floor((Date.now() - dateObj) / 1000);

    if (diff < 60) return t("t.just_now");
    if (diff < 3600) {
      return t("t.minutes_ago", { count: Math.floor(diff / 60) });
    }
    if (diff < 86400) {
      return t("t.hours_ago", { count: Math.floor(diff / 3600) });
    }

    return t("t.days_ago", { count: Math.floor(diff / 86400) });
  };

  return { formatTimeAgo };
}
