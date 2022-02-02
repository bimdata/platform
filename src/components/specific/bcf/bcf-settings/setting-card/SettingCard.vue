<template>
  <div class="setting-card p-12 m-y-12">
    <div class="setting-card__header flex items-center justify-between">
      <strong>{{ title }}</strong>
      <div class="flex items-center">
        <div
          class="setting-card__header__length flex items-center justify-center m-r-30"
          v-if="topicExtensions"
        >
          {{ topicExtensions.length }}
        </div>
        <BIMDataIcon
          name="chevron"
          fill
          color="default"
          size="xxs"
          :rotate="isOpen ? 90 : 0"
          @click="toggle"
        />
      </div>
    </div>
    <div v-show="isOpen">
      <div
        class="setting-card__subheader flex items-center justify-between m-t-6 m-b-12"
      >
        Liste des {{ title }}
        <BIMDataButton color="default" fill radius>
          <BIMDataIcon
            name="plus"
            fill
            color="default"
            size="xxxs"
            margin="0 6px 0 0"
          />
          <span>ajouter un élément</span>
        </BIMDataButton>
      </div>
      <ul class="setting-card__content bimdata-list">
        <li
          v-for="topicExtension in topicExtensions"
          :key="topicExtension"
          class="flex items-center p-x-12 m-b-6"
        >
          {{ topicExtension }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { useToggle } from "@/composables/toggle";
export default {
  props: {
    topicExtensions: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: ""
    }
  },
  setup() {
    const { isOpen, close, toggle } = useToggle();
    return {
      isOpen,
      close,
      toggle
    };
  }
};
</script>

<style scoped lang="scss" src="./SettingCard.scss"></style>
