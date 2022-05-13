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
        <span>{{ $t("BcfSettings.goBackButton") }}</span>
      </BIMDataButton>
      <span>{{ $t("BcfSettings.title") }}</span>
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
          {{ $t("BcfSettings.text") }}
        </p>
        <SettingCard
          extensionType="Priority"
          :availableExtensions="detailedExtensions.priorities"
        />
        <SettingCard
          extensionType="Type"
          :availableExtensions="detailedExtensions.topicTypes"
        />
        <SettingCard
          extensionType="Stage"
          :availableExtensions="detailedExtensions.stages"
        />
        <SettingCard
          extensionType="Status"
          :availableExtensions="detailedExtensions.topicStatuses"
        />
        <SettingCard
          extensionType="Label"
          :availableExtensions="detailedExtensions.topicLabels"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { watch } from "vue";
import { useBcf } from "@/state/bcf.js";
import { useProjects } from "@/state/projects.js";
import SettingCard from "./setting-card/SettingCard.vue";

export default {
  components: {
    SettingCard
  },
  emits: ["close"],
  setup() {
    const { currentProject } = useProjects();
    const { loadDetailedExtensions, detailedExtensions } = useBcf();
    watch(
      () => currentProject,
      async () => {
        await loadDetailedExtensions(currentProject.value);
      },
      {
        immediate: true
      }
    );

    return {
      detailedExtensions
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfSettings.scss"></style>
