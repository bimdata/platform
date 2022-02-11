<template>
  <EditBcfTopic
    v-if="isOpenEditTopic"
    :bcfTopic="bcfTopic"
    @close="isOpenEditTopic = false"
  />
  <div v-else class="open-topic-issue">
    <div class="open-topic-issue__header flex items-center justify-between">
      <div
        class="open-topic-issue__header__title flex justify-center items-center p-x-6"
      >
        <BIMDataTextBox maxWidth="250px" :text="bcfTopic.title" />
      </div>
      <div
        class="open-topic-issue__header__actions flex justify-center items-center"
      >
        <BIMDataButton
          color="default"
          ripple
          rounded
          icon
          @click="isOpenEditTopic = !isOpenEditTopic"
        >
          <BIMDataIcon name="edit" fill color="default" size="xxs" />
        </BIMDataButton>
        <BIMDataButton
          color="default"
          ripple
          rounded
          icon
          @click="deleteTopicModal = true"
        >
          <BIMDataIcon name="delete" fill color="high" size="xxs" />
        </BIMDataButton>
        <BIMDataButton
          color="default"
          ripple
          rounded
          icon
          @click="$emit('close')"
        >
          <BIMDataIcon name="close" fill color="granite-light" size="xxs" />
        </BIMDataButton>
      </div>
    </div>
    <div class="open-topic-issue__content p-r-6 p-b-6 p-l-6">
      <div
        class="open-topic-issue__content__subheader flex items-center justify-between m-t-12"
      >
        <div
          class="open-topic-issue__content__subheader__index flex justify-center items-center p-x-6"
          :class="getPriorityClasses"
        >
          {{ bcfTopic.index }}
        </div>
        <div
          class="open-topic-issue__content__subheader__date flex justify-center items-center"
        >
          {{ $d(bcfTopic.creationDate, "short") }}
        </div>
      </div>
      <div class="open-topic-issue__content__img text-center m-t-12">
        <div
          class="open-topic-issue__content__img__status flex p-6"
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
      <div class="open-topic-issue__content__card m-t-12 p-12 text-left">
        <div class="flex items-center m-b-12">
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
                ? $t("OpenTopicIssue.elements")
                : $t("OpenTopicIssue.noElements")
            }}
          </span>
        </div>
        <div>
          <span class="color-primary">{{ $t("OpenTopicIssue.type") }}</span>
          <span class="color-granite">{{
            bcfTopic.topicType
              ? bcfTopic.topicType
              : $t("OpenTopicIssue.noTypeSpecified")
          }}</span>
        </div>
        <div>
          <span class="color-primary">
            {{ $t("OpenTopicIssue.description") }}
          </span>
          <span class="color-granite">{{
            bcfTopic.description
              ? bcfTopic.description
              : $t("OpenTopicIssue.noDescriptionProvided")
          }}</span>
        </div>
        <div>
          <span class="color-primary">
            {{ $t("OpenTopicIssue.assignedTo") }}
          </span>
          <span class="color-granite">{{
            bcfTopic.assignedTo
              ? bcfTopic.assignedTo
              : $t("OpenTopicIssue.notAssigned")
          }}</span>
        </div>
        <div>
          <span class="color-primary">
            {{ $t("OpenTopicIssue.dueDate") }}
          </span>
          <span class="color-granite">{{
            bcfTopic.dueDate
              ? $d(bcfTopic.dueDate, "short")
              : $t("OpenTopicIssue.noDueDate")
          }}</span>
        </div>
      </div>
      <div class="open-topic-issue__content__card m-t-12 p-12 text-left">
        <div class="flex items-center m-b-12">
          <BIMDataIcon name="bcf" fill color="default" />
          <span class="m-l-6"> {{ $t("OpenTopicIssue.informations") }} </span>
        </div>
        <div>
          <span class="color-primary">{{ $t("OpenTopicIssue.status") }}</span>
          <span class="color-granite">{{
            bcfTopic.topicStatus || $t("OpenTopicIssue.noStatusSpecified")
          }}</span>
        </div>
        <div>
          <span class="color-primary"> {{ $t("OpenTopicIssue.stage") }} </span>
          <span class="color-granite">{{
            bcfTopic.stage || $t("OpenTopicIssue.noStageProvided")
          }}</span>
        </div>
        <div>
          <span class="color-primary">
            {{ $t("OpenTopicIssue.priority") }}
          </span>
          <span class="color-granite">{{
            bcfTopic.priority || $t("OpenTopicIssue.priorityNotDefined")
          }}</span>
        </div>
        <div class="m-t-12">
          <span class="color-primary"> {{ $t("OpenTopicIssue.tags") }} </span>
          <span class="color-granite">{{
            bcfTopic.labels.length
              ? bcfTopic.labels.join(", ")
              : $t("OpenTopicIssue.noTags")
          }}</span>
        </div>
      </div>
      <div class="open-topic-issue__comment m-t-12">
        <BIMDataButton width="100%" color="primary" fill radius>
          {{ $t("OpenTopicIssue.commentButton") }}
        </BIMDataButton>
      </div>
    </div>
    <ModalDeleteTopic
      v-if="deleteTopicModal"
      :bcfTopic="bcfTopic"
      @close="deleteTopicModal = false"
    />
  </div>
</template>

<script>
import { computed, ref } from "vue";

import NoImgTopicBcf from "../../../../images/NoImgTopicBcf.vue";
import EditBcfTopic from "@/components/specific/bcf/edit-bcf-topic/EditBcfTopic.vue";
import ModalDeleteTopic from "../modal-delete-topic/ModalDeleteTopic.vue";

export default {
  components: {
    EditBcfTopic,
    NoImgTopicBcf,
    ModalDeleteTopic
  },
  props: {
    bcfTopic: {
      type: Object,
      required: true
    }
  },
  emits: ["close"],
  setup(props) {
    const getPriorityClasses = ref("");
    if (props.bcfTopic.priority) {
      getPriorityClasses.value = props.bcfTopic.priority.toLowerCase();
    }

    const getStatusClasses = ref("");
    if (props.bcfTopic.topicStatus) {
      getStatusClasses.value = props.bcfTopic.topicStatus.toLowerCase();
    }

    const deleteTopicModal = ref(false);

    const isOpenEditTopic = ref(false);

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
      deleteTopicModal,
      isOpenEditTopic,
      getPriorityClasses,
      getStatusClasses,
      topicElements
    };
  }
};
</script>

<style scoped lang="scss" src="./OpenTopicIssue.scss"></style>
