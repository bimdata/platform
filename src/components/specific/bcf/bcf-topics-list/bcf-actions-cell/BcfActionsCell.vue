<template>
  <div class="bcf-actions-cell">
    <BIMDataButton
      color="primary"
      outline
      radius
      @click="openBcfTopic(bcfTopic)"
    >
      {{ $t("BcfActionsCell.seeButton") }}
    </BIMDataButton>
    <transition name="slide-fade-left">
      <div
        v-show="showSidePanel"
        key="bcf-actions-cell-side-panel"
        class="bcf-actions-cell__side-panel"
      >
        <OpenTopicIssue :bcfTopic="bcfTopic" @close="showSidePanel = false" />
      </div>
    </transition>
  </div>
</template>

<script>
import { reactive, ref } from "vue";

import OpenTopicIssue from "../open-topic-issue/OpenTopicIssue.vue";

export default {
  components: {
    OpenTopicIssue
  },
  props: {
    bcfTopic: {
      type: Object,
      required: true
    }
  },
  setup() {
    const showSidePanel = ref(false);
    const bcfTopicToOpen = reactive({});
    const openBcfTopic = topic => {
      showSidePanel.value = true;
      bcfTopicToOpen.value = topic;
    };
    return {
      bcfTopicToOpen,
      showSidePanel,
      openBcfTopic
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfActionsCell.scss"></style>
