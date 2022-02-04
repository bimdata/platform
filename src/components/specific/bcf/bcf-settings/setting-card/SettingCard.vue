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
        <BIMDataButton color="default" fill radius @click="toggleAddExtension">
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
          v-for="(topicExtension, index) in topicExtensions"
          :key="topicExtension"
          class="flex items-center justify-between p-x-12 m-b-6"
        >
          <SettingCardItem
            :title="title"
            :topicExtension="topicExtension"
            @edit="setTopicExtension(index, $event)"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { useToggle } from "@/composables/toggle";

import SettingCardItem from "./setting-card-item/SettingCardItem.vue";
export default {
  components: {
    SettingCardItem
  },
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
  emits: ["edit"],
  setup(props, { emit }) {
    const { isOpen, close, toggle } = useToggle();

    const {
      isOpen: showAddExtension,
      close: closeAddExtension,
      toggle: toggleAddExtension
    } = useToggle();

    const setTopicExtension = (index, extensionName) => {
      const newTopicExtensions = props.topicExtensions.slice();
      newTopicExtensions[index] = extensionName;
      emit("edit", newTopicExtensions);
    };

    return {
      isOpen,
      toggle,
      showAddExtension,
      // methods
      close,
      closeAddExtension,
      toggleAddExtension,
      setTopicExtension
    };
  }
};
</script>

<style scoped lang="scss" src="./SettingCard.scss"></style>
