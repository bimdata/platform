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
      {{ $t("CreateBcfTopic.dragDropImageText") }}
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
        :label="$t('CreateBcfTopic.typeLabel')"
        :options="detailedExtensions.topicTypes"
        optionKey="id"
        optionLabelKey="topicType"
        v-model="topicType"
      />
      <BIMDataSelect
        width="100%"
        :label="$t('CreateBcfTopic.priorityLabel')"
        :options="detailedExtensions.priorities"
        optionKey="id"
        optionLabelKey="priority"
        v-model="topicPriority"
      />
      <BIMDataSelect
        width="100%"
        :label="$t('CreateBcfTopic.statusLabel')"
        :options="detailedExtensions.topicStatuses"
        optionKey="id"
        optionLabelKey="topicStatus"
        v-model="topicStatus"
      />
      <BIMDataSelect
        width="100%"
        :label="$t('CreateBcfTopic.stageLabel')"
        :options="detailedExtensions.stages"
        optionKey="id"
        optionLabelKey="stage"
        v-model="topicPhase"
      />
      <BIMDataSelect
        width="100%"
        :label="$t('CreateBcfTopic.assignedToLabel')"
        :options="extensions.userIdType"
        v-model="topicAssignedTo"
      />
      <div class="due-date">
        <BIMDataInput
          margin="0"
          v-model="topicDate"
          :placeholder="$t('CreateBcfTopic.dueDateLabel')"
          :error="hasDateError"
          errorMessage="Format de date ou date incorrecte"
        />
        <p class="m-y-6">{{ $t("CreateBcfTopic.dateExample") }}</p>
      </div>
      <BIMDataTextarea
        :label="$t('CreateBcfTopic.descriptionLabel')"
        name="description"
        v-model="topicDescription"
        width="100%"
        fitContent
        resizable
      />
      <TagsInput v-model="topicTags" />
    </div>
    <div class="create-bcf-topic__footer m-t-24">
      <BIMDataButton width="100%" color="primary" fill radius @click="submit">
        {{ $t("CreateBcfTopic.validateButton") }}
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";

import { useBcf } from "@/state/bcf.js";
import { useProjects } from "@/state/projects.js";
import { useAppNotification } from "@/components/specific/app/app-notification/app-notification.js";
import { formatToDateObject, regexDate } from "@/utils/date";

import TagsInput from "./tags-input/TagsInput.vue";

export default {
  components: {
    TagsInput
  },
  props: {
    bcfTopics: {
      type: Array
    }
  },
  emits: ["submit"],
  setup(props) {
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
    const {
      loadExtensions,
      createTopic,
      loadBcfTopics,
      extensions,
      detailedExtensions
    } = useBcf();
    watch(
      () => currentProject.value,
      async () => {
        await loadExtensions(currentProject.value);
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
    const topicDate = ref("");
    const topicTags = ref([]);
    const hasError = ref(false);
    const hasDateError = ref(false);
    const { pushNotification } = useAppNotification();

    const isDateConform = ({ value }) => {
      if (!value) {
        return true;
      }
      if (!value.match(regexDate)) {
        return false;
      }
      const dateToCompare = formatToDateObject(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return dateToCompare.getTime() >= today.getTime();
    };

    const submit = async () => {
      if (!isDateConform(topicDate)) {
        hasDateError.value = true;
        return;
      }
      if (topicTitle.value && isDateConform(topicDate)) {
        const body = {
          title: topicTitle.value,
          topicType: topicType.value,
          priority: topicPriority.value,
          topicStatus: topicStatus.value,
          stage: topicPhase.value,
          assignedTo: topicAssignedTo.value,
          description: topicDescription.value,
          labels: topicTags.value
        };
        if (topicDate.value) {
          body.dueDate = formatToDateObject(topicDate.value);
        }
        try {
          await createTopic(currentProject.value, body);
          pushNotification({
            type: "success",
            title: "Success",
            message: "Topic BCF Créée"
          });
          await loadBcfTopics(currentProject.value);
        } finally {
          topicTitle.value = "";
          topicType.value = null;
          topicPriority.value = null;
          topicStatus.value = null;
          topicPhase.value = null;
          topicAssignedTo.value = null;
          topicDate.value = "";
          topicDescription.value = "";
          topicTags.value = [];
          hasDateError.value = false;
        }
      } else {
        hasError.value = true;
      }
    };

    return {
      hasError,
      hasDateError,
      topicTitle,
      topicType,
      topicPriority,
      topicStatus,
      topicPhase,
      topicAssignedTo,
      topicDate,
      topicDescription,
      topicTags,
      nextIndex,
      extensions,
      detailedExtensions,
      // Methods
      submit
    };
  }
};
</script>

<style scoped lang="scss" src="./CreateBcfTopic.scss"></style>
