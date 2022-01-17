<template>
  <div class="create-bcf-topic">
    <div class="create-bcf-topic__header flex items-center justify-between">
      <div
        class="create-bcf-topic__header__index flex items-center justify-center"
      >
        {{ nextIndex }}
      </div>
      <div
        class="create-bcf-topic__header__date flex items-center justify-center"
      >
        {{ $d(new Date(), "short") }}
      </div>
    </div>
    <div
      class="create-bcf-topic__image flex items-center justify-center m-t-24"
    >
      Drag and drop an image, or Browse
    </div>

    <div class="create-bcf-topic__content m-t-36">
      <BIMDataInput
        placeholder="Title*"
        v-model="topicTitle"
        :error="hasError"
        errorMessage="Titre manquant"
        @keyup.enter.stop="submit"
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
      <!-- <BIMDataSelect
        width="100%"
        label="Due date"
        :options="options"
        v-model="selection"
      /> -->
      <BIMDataTextarea
        label="Description"
        name="description"
        v-model="topicDescription"
        width="100%"
        fitContent
        resizable
      />
      <BIMDataInput placeholder="Tags" v-model="topicTitle" />
    </div>
    <div class="create-bcf-topic__footer m-t-24">
      <BIMDataButton width="100%" color="primary" fill radius @click="submit">
        Valider
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";

import { useBcf } from "@/state/bcf.js";
import { useProjects } from "@/state/projects.js";
import { useNotifications } from "@/composables/notifications.js";

export default {
  props: {
    bcfTopics: {
      type: Array,
      required: true
    }
  },
  emits: ["submit"],
  setup(props, { emit }) {
    const nextIndex = computed(() => {
      if (props.bcfTopics && props.bcfTopics.length > 0) {
        return (
          props.bcfTopics.reduce(
            (acc, cur) => (cur.index > acc ? cur.index : acc),
            0
          ) + 1
        );
      } else {
        return 1;
      }
    });

    const { currentProject } = useProjects();
    const { loadTopicExtensions, createTopic } = useBcf();
    const topicExtensions = ref([]);
    watch(
      () => currentProject,
      async () => {
        topicExtensions.value = await loadTopicExtensions(currentProject.value);
      },
      {
        immediate: true
      }
    );

    const topicTitle = ref("");
    const topicDescription = ref("");
    const topicType = ref();
    const topicPriority = ref();
    const topicStatus = ref();
    const topicPhase = ref();
    const topicAssignedTo = ref();
    const hasError = ref(false);
    const { pushNotification } = useNotifications();

    const submit = async () => {
      if (topicTitle.value) {
        const newTopic = await createTopic(currentProject.value, {
          title: topicTitle.value,
          description: topicDescription.value,
          topicType: topicType.value,
          priority: topicPriority.value,
          topicStatus: topicStatus.value,
          stage: topicPhase.value,
          assignedTo: topicAssignedTo.value
        });
        pushNotification({
          type: "success",
          title: "Success",
          message: "Topic BCF Créée"
        });
        emit("submit", newTopic);
      } else {
        hasError.value = true;
      }
    };

    return {
      hasError,
      topicTitle,
      topicType,
      topicPriority,
      topicStatus,
      topicPhase,
      topicAssignedTo,
      topicDescription,
      nextIndex,
      topicExtensions,
      // Methods
      submit
    };
  }
};
</script>

<style scoped lang="scss" src="./CreateBcfTopic.scss"></style>
