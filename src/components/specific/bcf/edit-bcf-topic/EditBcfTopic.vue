<template>
  <div class="edit-bcf-topic">
    <div class="edit-bcf-topic__header flex items-center justify-between">
      <BIMDataButton color="default" ripple icon @click="$emit('close')">
        <BIMDataIcon
          name="arrow"
          fill
          color="granite-light"
          size="xxs"
          margin="0 6px 0 0"
        />
        Back
      </BIMDataButton>
      <span class="text-center">Édition {{ bcfTopic.title }}</span>
    </div>
    <div
      class="edit-bcf-topic__subheader flex items-center justify-between m-t-12"
    >
      <div
        class="edit-bcf-topic__subheader__index flex items-center justify-center p-x-6"
      >
        {{ bcfTopic.index }}
      </div>
      <div
        class="edit-bcf-topic__subheader__date flex items-center justify-center p-x-6"
      >
        {{ $d(bcfTopic.creationDate, "short") }}
      </div>
    </div>
    <div class="edit-bcf-topic__image flex items-center justify-center m-t-12">
      <img
        v-if="bcfTopic.snapshots[0]"
        :src="bcfTopic.snapshots[0].snapshotData"
      />
      <span v-else> Drag and drop an image, or Browse </span>
    </div>

    <div class="edit-bcf-topic__content m-t-36">
      <BIMDataInput
        placeholder="Title*"
        v-model="topicTitle"
        errorMessage="Titre manquant"
      />
      <BIMDataSelect
        width="100%"
        label="Type"
        :options="topicExtensions.topicType"
        v-model="topicType"
      />
      <BIMDataSelect
        width="100%"
        label="Priority"
        :options="topicExtensions.priority"
        v-model="topicPriority"
      />
      <BIMDataSelect
        width="100%"
        label="Statut"
        :options="topicExtensions.topicStatus"
        v-model="topicStatus"
      />
      <BIMDataSelect
        width="100%"
        label="Phase"
        :options="topicExtensions.stage"
        v-model="topicPhase"
      />
      <BIMDataSelect
        width="100%"
        label="Assigned to"
        :options="topicExtensions.userIdType"
        v-model="topicAssignedTo"
      />
      <BIMDataTextarea
        label="Description"
        name="description"
        v-model="topicDescription"
        width="100%"
        fitContent
        resizable
      />
      <!-- <BIMDataInput placeholder="Tags" v-model="topicTags" margin="30px 0" /> -->
    </div>
    <div class="edit-bcf-topic__footer m-t-24">
      <BIMDataButton
        width="100%"
        color="primary"
        fill
        radius
        @click="updateBcfTopic"
      >
        Modifier ce BCF
      </BIMDataButton>
    </div>
    <div v-if="loading" class="overlay flex items-center justify-center">
      <BIMDataSpinner />
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";

import { useBcf } from "@/state/bcf.js";
import { useProjects } from "@/state/projects.js";

export default {
  props: {
    bcfTopic: {
      type: Object,
      required: true
    }
  },
  emits: ["close"],
  setup(props) {
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

    return {
      loading,
      topicTitle,
      topicType,
      topicPriority,
      topicStatus,
      topicPhase,
      topicAssignedTo,
      topicDescription,
      topicExtensions,
      // Methods
      updateBcfTopic
    };
  }
};
</script>

<style scoped lang="scss" src="./EditBcfTopic.scss"></style>
