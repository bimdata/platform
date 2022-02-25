<template>
  <div class="bcf-topic">
    <div class="bcf-topic__header">
      <div class="bcf-topic__header__infos flex">
        <div
          class="bcf-topic__header__infos__index flex items-center justify-center"
          :style="{
            'background-color': `#${priorityColor}`,
            color: adjustColor(`#${priorityColor}`, '#ffffff', '#2f374a')
          }"
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
          :style="{
            'background-color': `#${statusColor}`,
            color: adjustColor(`#${statusColor}`, '#ffffff', '#2f374a')
          }"
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
        <span :style="{ color: `#${priorityColor}` }">
          {{ bcfTopic.priority || $t("BcfTopicGridItem.noPriority") }}
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
import { computed, reactive, ref } from "vue";
import { adjustColor } from "@/components/specific/bcf/bcf-settings/adjustColor.js";

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
    },
    detailedExtensions: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const priorityColor = computed(() => {
      if (props.bcfTopic.priority) {
        const priorityDetail = props.detailedExtensions.priorities.find(
          priority => priority.priority === props.bcfTopic.priority
        );
        if (priorityDetail && priorityDetail.color) {
          return priorityDetail.color;
        }
      }
      return "D8D8D8";
    });

    const statusColor = computed(() => {
      if (props.bcfTopic.topicStatus) {
        const statusDetail = props.detailedExtensions.topicStatuses.find(
          status => status.topicStatus === props.bcfTopic.topicStatus
        );
        if (statusDetail && statusDetail.color) {
          return statusDetail.color;
        }
      }
      return "";
    });

    // const getStatusClasses = ref("");

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
      adjustColor,
      priorityColor,
      statusColor,
      bcfTopicToOpen,
      topicElements,
      showSidePanel,
      openBcfTopic
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfTopicGridItem.scss"></style>
