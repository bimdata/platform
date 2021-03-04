<template>
  <div class="dashboard-info-tile">
    <div class="dashboard-info-tile__head">
      <span class="dashboard-info-tile__head__title">
        {{ $t("Dashboard.security") }}
      </span>
      <BIMDataIcon
        class="dashboard-info-tile__head__icon"
        name="information"
        size="s"
      />
    </div>
    <div class="dashboard-info-tile__body">
      <span>Last login 1 January at 10:30 AM</span>
      <span>IP: 127.0.0.1</span>
      <span>{{ browserName }}/{{ browserVersion }} ({{ os }})</span>
    </div>
  </div>
</template>

<script>
import { detect as detectBrowser } from "detect-browser";
// Components
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";

export default {
  components: {
    BIMDataIcon
  },
  setup() {
    const { name, version: browserVersion, os } = detectBrowser();

    const browserName = name
      .split("-")
      .map(s => `${s[0].toUpperCase()}${s.slice(1)}`)
      .join(" ");

    return {
      // References
      browserName,
      browserVersion,
      os
    };
  }
};
</script>

<style scoped lang="scss" src="./DashboardInfoTile.scss"></style>
