<template>
  <div class="setting-card p-12 m-y-12">
    <div class="setting-card__header flex items-center justify-between">
      <strong>{{ $t(`SettingCard.title.priorities`) }}</strong>
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
        {{ $t(`SettingCard.text.priorities`) }}
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
            :placeholder="$t(`SettingCard.input.priorities`)"
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
        <PriorityItem
          :priority="topicExtension"
          v-for="topicExtension in topicDetailedExtensions"
          :key="topicExtension.id"
        />
      </ul>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useBcf } from "@/state/bcf.js";
import { useProjects } from "@/state/projects.js";
import { useToggle } from "@/composables/toggle";
import { getRandomHexColor } from "@/components/generic/color-selector/colors.js";

import PriorityItem from "./priority-item/PriorityItem.vue";
export default {
  components: {
    PriorityItem
  },
  props: {
    topicDetailedExtensions: {
      type: Array
    }
  },
  setup() {
    const { isOpen, close, toggle } = useToggle();

    const { isOpen: showAddExtension, toggle: toggleAddExtension } =
      useToggle();

    const closeAddExtension = () => {
      newTopicExtensionName.value = "";
      showAddExtension.value = false;
    };

    const { currentProject } = useProjects();
    const { createTopicExtensionPriority } = useBcf();
    const newTopicExtensionName = ref("");
    const addTopicExtension = async () => {
      await createTopicExtensionPriority(currentProject.value, {
        priority: newTopicExtensionName.value,
        color: getRandomHexColor()
      });
      newTopicExtensionName.value = "";
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
      addTopicExtension
    };
  }
};
</script>

<style scoped lang="scss" src="../SettingCard.scss"></style>
