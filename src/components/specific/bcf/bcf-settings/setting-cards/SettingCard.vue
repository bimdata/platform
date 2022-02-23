<template>
  <div class="setting-card p-12 m-y-12">
    <div class="setting-card__header flex items-center justify-between">
      <strong>{{ $t(`SettingCard.title.${extension}`) }}</strong>
      <div class="flex items-center">
        <div
          class="setting-card__header__length flex items-center justify-center m-r-30"
          v-if="topicDetailedExtensions"
        >
          {{ topicDetailedExtensions.length }}
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
        {{ $t(`SettingCard.text.${extension}`) }}
        <BIMDataButton color="default" fill radius @click="toggleAddExtension">
          <BIMDataIcon
            name="plus"
            fill
            color="default"
            size="xxxs"
            margin="0 6px 0 0"
          />
          <span>{{ $t("SettingCard.addButton") }}</span>
        </BIMDataButton>
      </div>
      <transition name="list">
        <div v-if="showAddExtension" class="m-b-12">
          <BIMDataInput
            :placeholder="$t(`SettingCard.input.${extension}`)"
            v-model="newTopicExtensionName"
            @keyup.enter.stop="addTopicExtension"
          />

          <div class="flex items-center justify-end">
            <BIMDataButton
              ghost
              radius
              class="m-r-6"
              @click="closeAddExtension"
              >{{ $t("SettingCard.cancelButton") }}</BIMDataButton
            >
            <BIMDataButton
              color="primary"
              fill
              radius
              @click="addTopicExtension"
              >{{ $t("SettingCard.validateButton") }}</BIMDataButton
            >
          </div>
        </div>
      </transition>
      <ul class="setting-card__content bimdata-list">
        <SettingCardItem
          :title="title"
          :topicExtension="topicExtension"
          @edit="setTopicExtension(index, $event)"
          @delete="deleteTopicExtension(index, $event)"
          v-for="(topicExtension, index) in topicDetailedExtensions"
          :key="topicExtension"
        />
      </ul>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

import { useToggle } from "@/composables/toggle";

import SettingCardItem from "./setting-card-item/SettingCardItem.vue";
export default {
  components: {
    SettingCardItem
  },
  props: {
    extension: {
      type: String,
      required: true
    },
    topicDetailedExtensions: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: ""
    }
  },
  emits: ["edit", "add", "delete"],
  setup(props, { emit }) {
    const { isOpen, close, toggle } = useToggle();

    const { isOpen: showAddExtension, toggle: toggleAddExtension } =
      useToggle();

    const closeAddExtension = () => {
      newTopicExtensionName.value = "";
      showAddExtension.value = false;
    };

    const setTopicExtension = (index, extensionName) => {
      const newTopicExtensions = props.topicDetailedExtensions.slice();
      newTopicExtensions[index] = extensionName;
      emit("edit", newTopicExtensions);
    };

    const newTopicExtensionName = ref("");
    const addTopicExtension = () => {
      const newTopicExtensions = props.topicDetailedExtensions.slice();
      newTopicExtensions.value = newTopicExtensions.concat([
        newTopicExtensionName.value
      ]);
      emit("add", newTopicExtensions.value);
      newTopicExtensionName.value = "";
    };

    const deleteTopicExtension = (index, extensionName) => {
      const newTopicExtensions = props.topicDetailedExtensions
        .slice()
        .filter(newTopicExtension => newTopicExtension !== extensionName);
      emit("delete", newTopicExtensions);
    };

    return {
      isOpen,
      toggle,
      showAddExtension,
      newTopicExtensionName,
      // methods
      close,
      closeAddExtension,
      toggleAddExtension,
      setTopicExtension,
      addTopicExtension,
      deleteTopicExtension
    };
  }
};
</script>

<style scoped lang="scss" src="./SettingCard.scss"></style>
