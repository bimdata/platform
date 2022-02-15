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
        <strong>
          {{ $t("BcfTopicGridItem.priority") }}
        </strong>
        <span :class="getPriorityClasses">
          {{ bcfTopic.priority || $t("BcfTopicGridItem.notSpecified") }}
        </span>
      </div>
      <div>
        <strong>
          {{ $t("BcfTopicGridItem.assignedTo") }}
        </strong>
        <span>
          {{ bcfTopic.assignedTo || $t("BcfTopicGridItem.notSpecified") }}
        </span>
      </div>
      <div class="flex justify-around m-t-12">
        <div class="flex items-center">
          <BIMDataIcon
            name="model3d"
            fill
            color="default"
            size="xs"
            margin="0 6px 0 0"
          />
          <span class="m-r-6" v-if="topicElements.length > 0">
            {{ topicElements.length }}
          </span>
          <span>
            {{
              topicElements.length
                ? $t("BcfTopicGridItem.elements")
                : $t("BcfTopicGridItem.noElements")
            }}
          </span>
        </div>
        <BIMDataButton
          color="primary"
          fill
          radius
          width="48%"
          @click="openBcfTopic(bcfTopic)"
          >{{ $t("BcfTopicGridItem.see") }}</BIMDataButton
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
import { computed, reactive, ref, watch } from "vue";

import NoImgTopicBcf from "../../../images/NoImgTopicBcf.vue";

import OpenTopicIssue from "../bcf-topics-list/open-topic-issue/OpenTopicIssue.vue";

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
    const getStatusClasses = ref("");

    watch(
      () => props.bcfTopic,
      () => {
        if (props.bcfTopic.priority) {
          getPriorityClasses.value = props.bcfTopic.priority.toLowerCase();
        }
        if (props.bcfTopic.topicStatus) {
          getStatusClasses.value = props.bcfTopic.topicStatus.toLowerCase();
        }
      },
      { immediate: true }
    );

    const showSidePanel = ref(false);
    const bcfTopicToOpen = reactive({});
    const openBcfTopic = topic => {
      showSidePanel.value = true;
      bcfTopicToOpen.value = topic;
    };

    const topicElements = computed(() => {
      if (
        props.bcfTopic.components &&
        props.bcfTopic.components.length > 0 &&
        props.bcfTopic.components[0].selection
      ) {
        return props.bcfTopic.components[0].selection;
      } else {
        return [];
      }
    });

    return {
      getPriorityClasses,
      getStatusClasses,
      bcfTopicToOpen,
      topicElements,
      showSidePanel,
      openBcfTopic
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfTopicGridItem.scss"></style>
