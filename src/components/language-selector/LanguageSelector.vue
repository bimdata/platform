<template>
  <div class="language-selector">
    <div class="language-selector__title">
      <span>{{ $t("UserMenu.selectLanguage") }}</span>
      <BIMDataButton ghost rounded icon @click="$emit('close')">
        <BIMDataIcon name="close" size="xxxs" />
      </BIMDataButton>
    </div>
    <div class="language-selector__content">
      <span
        v-for="lang in $i18n.availableLocales"
        :key="lang"
        class="lang-badge"
        :class="{ selected: $i18n.locale === lang }"
        @click="$i18n.locale = lang"
      >
        {{ lang }}
      </span>
    </div>
  </div>
</template>

<script>
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon
  },
  emits: ["close"]
};
</script>

<style scoped lang="scss" src="./LanguageSelector.scss"></style>
