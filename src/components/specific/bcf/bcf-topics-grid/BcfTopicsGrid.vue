<template>
  <div class="bcf-topic">
    <div class="bcf-topic__header">
      <div class="bcf-topic__header__infos flex">
        <div
          class="bcf-topic__header__infos__index flex items-center justify-center"
          :class="getPriorityClasses"
        >
          {{ bcfTopic.index }}
        </div>
        <div class="bcf-topic__header__infos__title flex items-center m-l-12">
          <BIMDataTextBox maxWidth="100% - 48px" :text="bcfTopic.title" />
        </div>
      </div>
      <div class="bcf-topic__header__img flex items-center justify-center">
        <div
          class="bcf-topic__header__img__status flex p-6"
          :class="getStatusClasses"
          v-if="bcfTopic.topicStatus"
        >
          <BIMDataIcon name="information" fill color="default" />
          <span class="m-l-6">{{ bcfTopic.topicStatus }}</span>
        </div>
        <img
          v-if="
            bcfTopic.snapshots &&
            bcfTopic.snapshots.length > 0 &&
            bcfTopic.snapshots[0] !== undefined
          "
          :src="bcfTopic.snapshots[0].snapshotData"
          alt=""
        />
        <NoImgTopicBcf class="no-img-topic" v-else />
      </div>
    </div>
    <div class="bcf-topic__content p-12">
      <div class="bcf-topic__content__priority">
        <strong>Priorité : </strong>
        <span v-if="bcfTopic.priority" :class="getPriorityClasses">{{
          bcfTopic.priority
        }}</span>
        <span v-else>Non renseigné</span>
      </div>
      <div>
        <strong>Assigné à : </strong>
        <span v-if="bcfTopic.assignedTo">{{ bcfTopic.assignedTo }}</span>
        <span v-else>Non renseigné</span>
      </div>
      <div class="flex justify-around m-t-12">
        <BIMDataButton
          color="default"
          fill
          radius
          width="48%"
          :disabled="
            !bcfTopic.components.length ||
            !bcfTopic.components[0].selection.length
          "
        >
          <BIMDataIcon
            name="model3d"
            fill
            color="default"
            size="xs"
            margin="0 6px 0 0"
          />
          <span
            class="m-r-6"
            v-if="
              bcfTopic.components.length &&
              bcfTopic.components[0].selection.length
            "
            >{{ bcfTopic.components[0].selection.length }}</span
          >
          <span>
            {{
              bcfTopic.components.length &&
              bcfTopic.components[0].selection.length
                ? "Elements"
                : "0 Element"
            }}</span
          >
        </BIMDataButton>
        <BIMDataButton
          color="primary"
          fill
          radius
          width="48%"
          @click="openBcfTopic(bcfTopic)"
          >Voir</BIMDataButton
        >
      </div>
    </div>
    <transition name="slide-fade-left">
      <div
        v-show="showSidePanel"
        key="bcf-topic-side-panel"
        class="bcf-topic__side-panel"
      >
        <OpenTopicIssue :bcfTopic="bcfTopic" @close="showSidePanel = false" />
      </div>
    </transition>
  </div>
</template>

<script>
import { reactive, ref } from "vue";

import NoImgTopicBcf from "../../../images/NoImgTopicBcf.vue";

import OpenTopicIssue from "../../../specific/bcf/bcf-topics-list/open-topic-issue/OpenTopicIssue.vue";

export default {
  components: {
    NoImgTopicBcf,
    OpenTopicIssue
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    bcfTopic: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const getPriorityClasses = ref("");
    if (props.bcfTopic.priority) {
      getPriorityClasses.value = props.bcfTopic.priority.toLowerCase();
    }

    const getStatusClasses = ref("");
    if (props.bcfTopic.topicStatus) {
      getStatusClasses.value = props.bcfTopic.topicStatus.toLowerCase();
    }

    const showSidePanel = ref(false);
    const bcfTopicToOpen = reactive({});
    const openBcfTopic = topic => {
      showSidePanel.value = true;
      bcfTopicToOpen.value = topic;
    };

    return {
      getPriorityClasses,
      getStatusClasses,
      bcfTopicToOpen,
      showSidePanel,
      openBcfTopic
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfTopicsGrid.scss"></style>
