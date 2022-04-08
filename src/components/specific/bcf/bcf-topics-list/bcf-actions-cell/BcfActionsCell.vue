<template>
  <div class="bcf-actions-cell">
    <BIMDataButton color="primary" fill radius @click="openBcfTopic(bcfTopic)">
      {{ $t("BcfActionsCell.seeButton") }}
    </BIMDataButton>
    <transition name="slide-fade-left">
      <div
        v-if="showSidePanel"
        key="bcf-actions-cell-side-panel"
        class="bcf-actions-cell__side-panel"
      >
        <OpenTopicIssue
          :bcfTopic="bcfTopic"
          @close="showSidePanel = false"
          :detailedExtensions="detailedExtensions"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import { ref } from "vue";

import { useBcf } from "@/state/bcf.js";
import { useProjects } from "@/state/projects.js";

import OpenTopicIssue from "../open-topic-issue/OpenTopicIssue.vue";

export default {
  components: {
    OpenTopicIssue
  },
  props: {
    bcfTopic: {
      type: Object,
      required: true
    },
    detailedExtensions: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { currentProject } = useProjects();
    const { loadTopicComments } = useBcf();

    const showSidePanel = ref(false);
    const openBcfTopic = async () => {
      showSidePanel.value = true;
      if (!props.bcfTopic.comments) {
        await loadTopicComments(currentProject.value, props.bcfTopic);
      }
    };
    return {
      showSidePanel,
      openBcfTopic
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfActionsCell.scss"></style>
