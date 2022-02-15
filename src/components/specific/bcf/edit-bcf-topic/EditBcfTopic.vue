<template>
  <div class="edit-bcf-topic">
    <div class="edit-bcf-topic__header flex items-center justify-between">
      <BIMDataButton color="default" ripple icon @click="goBack">
        <BIMDataIcon
          name="arrow"
          fill
          color="granite-light"
          size="xxs"
          margin="0 6px 0 0"
        />
        {{ $t("EditBcfTopic.goBackButton") }}
      </BIMDataButton>
      <span class="text-center"
        >{{ $t("EditBcfTopic.editing") }} {{ bcfTopic.title }}</span
      >
    </div>
    <div class="edit-bcf-topic__content p-r-6">
      <div
        class="edit-bcf-topic__content__subheader flex items-center justify-between m-t-12"
      >
        <div
          class="edit-bcf-topic__content__subheader__index flex items-center justify-center p-x-6"
        >
          {{ bcfTopic.index }}
        </div>
        <div
          class="edit-bcf-topic__content__subheader__date flex items-center justify-center p-x-6"
        >
          {{ $d(bcfTopic.creationDate, "short") }}
        </div>
      </div>
      <div
        class="edit-bcf-topic__content__image flex items-center justify-center m-t-12"
      >
        <img
          v-if="bcfTopic.snapshots[0]"
          :src="bcfTopic.snapshots[0].snapshotData"
        />
        <span v-else> {{ $t("EditBcfTopic.dragDropImageText") }} </span>
      </div>

      <div class="edit-bcf-topic__content__content m-t-36">
        <BIMDataInput
          :placeholder="$t('EditBcfTopic.titlePlaceholder')"
          v-model="topicTitle"
          errorMessage="Titre manquant"
        />
        <BIMDataSelect
          width="100%"
          :label="$t('EditBcfTopic.typeLabel')"
          :options="topicExtensions.topicType"
          v-model="topicType"
        />
        <BIMDataSelect
          width="100%"
          :label="$t('EditBcfTopic.priorityLabel')"
          :options="topicExtensions.priority"
          v-model="topicPriority"
        />
        <BIMDataSelect
          width="100%"
          :label="$t('EditBcfTopic.statusLabel')"
          :options="topicExtensions.topicStatus"
          v-model="topicStatus"
        />
        <BIMDataSelect
          width="100%"
          :label="$t('EditBcfTopic.stageLabel')"
          :options="topicExtensions.stage"
          v-model="topicPhase"
        />
        <BIMDataSelect
          width="100%"
          :label="$t('EditBcfTopic.assignedToLabel')"
          :options="topicExtensions.userIdType"
          v-model="topicAssignedTo"
        />
        <BIMDataTextarea
          :label="$t('EditBcfTopic.descriptionLabel')"
          name="description"
          v-model="topicDescription"
          width="100%"
          fitContent
          resizable
        />
        <!-- <BIMDataInput :placeholder="$t('EditBcfTopic.tagsPlaceholder')" v-model="topicTags" margin="30px 0" /> -->
      </div>
    </div>
    <div class="edit-bcf-topic__footer m-t-12">
      <BIMDataButton
        width="100%"
        color="primary"
        fill
        radius
        @click="updateBcfTopic"
      >
        {{ $t("EditBcfTopic.editButton") }}
      </BIMDataButton>
    </div>
    <EditBcfTopicModal
      v-if="openModal"
      :bcfTopic="bcfTopic"
      @close="$emit('close')"
      @continue="openModal = false"
    />
    <div v-if="loading" class="overlay flex items-center justify-center">
      <BIMDataLoading />
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";

import { useBcf } from "@/state/bcf.js";
import { useProjects } from "@/state/projects.js";

import EditBcfTopicModal from "./edit-bcf-topic-modal/EditBcfTopicModal.vue";

export default {
  components: {
    EditBcfTopicModal
  },
  props: {
    bcfTopic: {
      type: Object,
      required: true
    }
  },
  emits: ["close"],
  setup(props, { emit }) {
    const { topicExtensions, updateTopic } = useBcf();
    const topicTitle = ref("");
    const topicType = ref("");
    const topicPriority = ref("");
    const topicStatus = ref("");
    const topicPhase = ref("");
    const topicAssignedTo = ref("");
    const topicDescription = ref("");
    // const topicTags = ref([]);

    watch(
      () => props.bcfTopic,
      () => {
        topicTitle.value = props.bcfTopic.title;
        if (props.bcfTopic.topicType) {
          topicType.value = props.bcfTopic.topicType;
        } else {
          topicType.value = null;
        }
        if (props.bcfTopic.priority) {
          topicPriority.value = props.bcfTopic.priority;
        } else {
          topicPriority.value = null;
        }
        if (props.bcfTopic.topicStatus) {
          topicStatus.value = props.bcfTopic.topicStatus;
        } else {
          topicStatus.value = null;
        }
        if (props.bcfTopic.stage) {
          topicPhase.value = props.bcfTopic.stage;
        } else {
          topicPhase.value = null;
        }
        if (props.bcfTopic.assignedTo) {
          topicAssignedTo.value = props.bcfTopic.assignedTo;
        } else {
          topicAssignedTo.value = null;
        }
        if (props.bcfTopic.description) {
          topicDescription.value = props.bcfTopic.description;
        } else {
          topicDescription.value = null;
        }
        // if (props.bcfTopic.labels) {
        //   topicTags.value = props.bcfTopic.labels;
        // } else {
        //   topicTags.value = [];
        // }
      },
      { immediate: true }
    );

    const { currentProject } = useProjects();
    const loading = ref(false);

    const updateBcfTopic = async () => {
      try {
        loading.value = true;
        await updateTopic(currentProject.value, props.bcfTopic, {
          title: topicTitle.value,
          topicType: topicType.value,
          priority: topicPriority.value,
          topicStatus: topicStatus.value,
          stage: topicPhase.value,
          assignedTo: topicAssignedTo.value,
          description: topicDescription.value
          // labels: topicTags.value
        });
      } finally {
        loading.value = false;
      }
    };

    const openModal = ref(false);
    const goBack = () => {
      if (
        topicTitle.value !== props.bcfTopic.title ||
        topicType.value !== props.bcfTopic.topicType ||
        topicPriority.value !== props.bcfTopic.priority ||
        topicStatus.value !== props.bcfTopic.topicStatus ||
        topicPhase.value !== props.bcfTopic.stage ||
        topicAssignedTo.value !== props.bcfTopic.assignedTo ||
        topicDescription.value !== props.bcfTopic.description
      ) {
        openModal.value = true;
      } else {
        emit("close");
      }
    };

    return {
      loading,
      openModal,
      topicTitle,
      topicType,
      topicPriority,
      topicStatus,
      topicPhase,
      topicAssignedTo,
      topicDescription,
      topicExtensions,
      // Methods
      updateBcfTopic,
      goBack
    };
  }
};
</script>

<style scoped lang="scss" src="./EditBcfTopic.scss"></style>
