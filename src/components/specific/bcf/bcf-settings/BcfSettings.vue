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
        <template v-for="extension of extensionKeys" :key="extension">
          <SettingCard
            v-if="topicExtensions[extension]"
            :extension="extension"
            :topicExtensions="topicExtensions[extension]"
            @edit="updateExtension(extension, $event)"
            @add="updateExtension(extension, $event)"
            @delete="updateExtension(extension, $event)"
          />
        </template>
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

const extensionKeys = [
  "priority",
  "topicLabel",
  "topicStatus",
  "topicType",
  "stage"
];

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

    const updateExtension = async (extension, value) => {
      try {
        await updateTopicExtensions(currentProject.value, {
          [extension]: value
        });
      } catch (error) {
        console.log(error);
      }
    };

    return {
      extensionKeys,
      topicExtensions,
      updateExtension
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfSettings.scss"></style>
