<template>
  <div class="language-selector">
    <div class="language-selector__title">
      <span class="m-l-6">{{ $t("LanguageSelector.title") }}</span>
      <BIMDataButton ghost rounded icon @click="$emit('close')">
        <BIMDataIconClose size="xxxs" />
      </BIMDataButton>
    </div>
    <div class="language-selector__content">
      <span
        class="language-selector__content__item"
        v-for="lang in $i18n.availableLocales"
        :key="lang"
        :class="{ selected: $i18n.locale === lang }"
        @click="$i18n.locale = lang"
      >
        {{ lang }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["close"]
};
</script>

<style scoped lang="scss" src="./LanguageSelector.scss"></style>
