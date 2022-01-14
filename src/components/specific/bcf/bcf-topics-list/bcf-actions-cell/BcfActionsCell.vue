<template>
  <div class="bcf-actions-cell">
    <BIMDataButton
      color="primary"
      outline
      radius
      @click="openBcfTopic(bcfTopic.guid)"
    >
      Ouvrir
    </BIMDataButton>
    <transition name="slide-fade-right">
      <div
        v-show="showSidePanel"
        key="test"
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
