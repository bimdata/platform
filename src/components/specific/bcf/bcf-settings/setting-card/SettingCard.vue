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
      <transition name="list">
        <div v-if="showAddExtension" class="m-b-12">
          <BIMDataInput
            placeholder="Add a new priority"
            v-model="newTopicExtensionName"
            @keyup.enter.stop="addTopicExtension"
          />

          <div class="flex items-center justify-end">
            <BIMDataButton ghost radius class="m-r-6" @click="closeAddExtension"
              >Annuler</BIMDataButton
            >
            <BIMDataButton
              color="primary"
              fill
              radius
              @click="addTopicExtension"
              >Valider</BIMDataButton
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
          v-for="(topicExtension, index) in topicExtensions"
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
    topicExtensions: {
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
      const newTopicExtensions = props.topicExtensions.slice();
      newTopicExtensions[index] = extensionName;
      emit("edit", newTopicExtensions);
    };

    const newTopicExtensionName = ref("");
    const addTopicExtension = () => {
      const newTopicExtensions = props.topicExtensions.slice();
      newTopicExtensions.value = newTopicExtensions.concat([
        newTopicExtensionName.value
      ]);
      emit("add", newTopicExtensions.value);
      newTopicExtensionName.value = "";
    };

    const deleteTopicExtension = (index, extensionName) => {
      const newTopicExtensions = props.topicExtensions
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
