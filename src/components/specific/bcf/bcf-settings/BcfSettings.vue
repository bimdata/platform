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
        <SettingCard
          v-if="topicExtensions.priority"
          :title="$t('BcfSettings.piorityTitle')"
          :topicExtensions="topicExtensions.priority"
          @edit="updatePriority($event)"
          @add="updatePriority($event)"
          @delete="updatePriority($event)"
        />
        <SettingCard
          v-if="topicExtensions.topicLabel"
          :title="$t('BcfSettings.labelTitle')"
          :topicExtensions="topicExtensions.topicLabel"
        />
        <SettingCard
          v-if="topicExtensions.topicStatus"
          :title="$t('BcfSettings.statusTitle')"
          :topicExtensions="topicExtensions.topicStatus"
        />
        <SettingCard
          v-if="topicExtensions.topicType"
          :title="$t('BcfSettings.typeTitle')"
          :topicExtensions="topicExtensions.topicType"
        />
        <SettingCard
          v-if="topicExtensions.stage"
          :title="$t('BcfSettings.stageTitle')"
          :topicExtensions="topicExtensions.stage"
        />
      </div>
      <BIMDataButton color="primary" fill radius class="m-x-18">
        {{ $t("BcfSettings.validateButton") }}
      </BIMDataButton>
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
    const { loadTopicExtensions, topicExtensions, updateTopicExtensions } =
      useBcf();
    watch(
      () => currentProject,
      async () => {
        await loadTopicExtensions(currentProject.value);
      },
      {
        immediate: true
      }
    );

    const updatePriority = async priorities => {
      try {
        await updateTopicExtensions(currentProject.value, {
          priority: priorities
        });
      } catch (error) {
        console.log(error);
      }
    };

    return {
      topicExtensions,
      updatePriority
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfSettings.scss"></style>
