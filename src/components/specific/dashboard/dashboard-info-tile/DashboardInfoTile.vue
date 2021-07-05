<template>
  <div class="dashboard-info-tile">
    <div class="dashboard-info-tile__head">
      <span class="dashboard-info-tile__head__title">
        {{ $t("DashboardInfoTile.title") }}
      </span>
      <BIMDataIcon
        class="dashboard-info-tile__head__icon"
        name="information"
        size="s"
      />
    </div>
    <div class="dashboard-info-tile__body">
      <span>{{ browserName }}/{{ browserVersion }} ({{ os }})</span>
    </div>
  </div>
</template>

<script>
import { detect as detectBrowser } from "detect-browser";

export default {
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
