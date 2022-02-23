<template>
  <div class="bcf-settings">
    <div class="bcf-settings__header flex items-center justify-between p-x-18">
      <BIMDataButton color="default" ripple radius icon @click="$emit('close')">
        <BIMDataIcon
          name="arrow"
          fill
          color="default"
          size="xxs"
          margin="0 6px 0 0"
        />
        <span> {{ $t("BcfSettings.goBackButton") }}</span>
      </BIMDataButton>
      <span> {{ $t("BcfSettings.title") }}</span>
      <BIMDataIcon
        name="close"
        fill
        color="default"
        @click="$emit('close')"
        size="xxs"
      />
    </div>
    <div class="bcf-settings__content flex justify-between p-b-18">
      <div class="bcf-settings__content__settings p-18">
        <p class="m-b-24 p-x-48 text-center color-granite">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <SettingCardPriority
          v-if="topicDetailedExtensions.priorities"
          :topicDetailedExtensions="topicDetailedExtensions.priorities"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { watch } from "vue";
import { useBcf } from "@/state/bcf.js";
import { useProjects } from "@/state/projects.js";
import SettingCardPriority from "./setting-cards/setting-card-priority/SettingCardPriority.vue";

const extensionKeys = [
  "priorities",
  "labels",
  "topicStatuses",
  "topicTypes",
  "stages"
];

export default {
  components: {
    SettingCardPriority
  },
  emits: ["close"],
  setup() {
    const { currentProject } = useProjects();
    const { loadTopicDetailedExtensions, topicDetailedExtensions } = useBcf();
    watch(
      () => currentProject,
      async () => {
        await loadTopicDetailedExtensions(currentProject.value);
      },
      {
        immediate: true
      }
    );

    return {
      extensionKeys,
      topicDetailedExtensions
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfSettings.scss"></style>
