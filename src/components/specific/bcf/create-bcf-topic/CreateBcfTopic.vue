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
      :class="{ 'no-img': !viewpoints.length > 0 }"
    >
      <div class="img-previews flex" v-if="viewpoints.length > 0">
        <div
          class="img-preview"
          v-for="(viewpoint, i) in viewpoints.slice(0, 4)"
          :key="i"
        >
          <img :src="viewpoint.snapshot.snapshot_data" loading="lazy" />
          <BIMDataButton
            color="default"
            fill
            rounded
            icon
            @click="removeViewpoint(i)"
            class="remove-viewpoint"
          >
            <BIMDataIcon name="delete" size="xs" fill color="high" />
          </BIMDataButton>
        </div>
      </div>
      <div class="img-input" v-else>
        <div class="img-input__title">
          <!-- {{ $t("CreateBcfTopic.dragDropImageText") }} -->
          <label for="files">Parcourir</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            multiple
            @change="upload"
            id="files"
            style="display: none"
          />
        </div>
      </div>
    </div>
    <div
      class="create-bcf-topic__add-img flex justify-center m-t-18"
      v-if="viewpoints.length > 0"
    >
      <BIMDataButton
        width="100%"
        color="primary"
        fill
        radius
        :disabled="viewpoints.length >= 4"
      >
        <label
          for="files"
          class="flex items-center justify-center"
          :disabled="viewpoints.length >= 4"
        >
          <BIMDataIcon name="camera" size="xs" margin="0 12px 0 0" />
          Ajouter une image
        </label>
        <input
          type="file"
          accept="image/png, image/jpeg"
          multiple
          @change="upload"
          id="files"
          style="display: none"
          :disabled="viewpoints.length >= 4"
        />
      </BIMDataButton>
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
      <BIMDataSelect
        :multi="true"
        width="100%"
        :label="$t('CreateBcfTopic.tagsLabel')"
        :options="detailedExtensions.topicLabels"
        optionKey="id"
        optionLabelKey="label"
        v-model="topicTags"
      />
    </div>
    <div class="create-bcf-topic__footer m-t-24">
      <BIMDataButton
        width="100%"
        color="primary"
        fill
        radius
        @click="submit"
        :disabled="topicTitle === ''"
      >
        {{ $t("CreateBcfTopic.validateButton") }}
      </BIMDataButton>
    </div>
    <div v-if="loading" class="overlay flex items-center justify-center">
      <BIMDataLoading />
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";

import { useBcf } from "@/state/bcf.js";
import { useProjects } from "@/state/projects.js";
import { useAppNotification } from "@/components/specific/app/app-notification/app-notification.js";
import { formatToDateObject, regexDate } from "@/utils/date";

export default {
  props: {
    bcfTopics: {
      type: Array
    }
  },
  emits: ["submit"],
  setup(props) {
    const { currentProject } = useProjects();
    const {
      loadExtensions,
      loadBcfTopics,
      extensions,
      detailedExtensions,
      createFullTopic
    } = useBcf();

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

    watch(
      () => currentProject.value,
      async () => {
        await loadExtensions(currentProject.value);
      },
      {
        immediate: true
      }
    );

    const viewpoints = ref([]);
    const upload = event => {
      [...event.target.files].forEach(file => {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          viewpoints.value.push({
            snapshot: {
              snapshot_type: file.type,
              snapshot_data: reader.result
            }
          });
        });
        reader.readAsDataURL(file);
      });
    };

    const removeViewpoint = index => {
      viewpoints.value.splice(index, 1);
    };

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
    const loading = ref(false);

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
          topic_type: topicType.value?.topicType,
          priority: topicPriority.value?.priority,
          topic_status: topicStatus.value?.topicStatus,
          stage: topicPhase.value?.stage,
          assigned_to: topicAssignedTo?.value,
          description: topicDescription?.value,
          labels: topicTags.value?.map(topicTag => topicTag.label),
          viewpoints: viewpoints.value
        };
        if (topicDate.value) {
          body.dueDate = formatToDateObject(topicDate.value);
        }
        loading.value = true;
        await createFullTopic(currentProject.value, body);
        pushNotification({
          type: "success",
          title: "Success",
          message: "Topic BCF Créée"
        });
        await loadBcfTopics(currentProject.value);
        topicTitle.value = "";
        topicType.value = null;
        topicPriority.value = null;
        topicStatus.value = null;
        topicPhase.value = null;
        topicAssignedTo.value = null;
        topicDate.value = "";
        topicDescription.value = "";
        topicTags.value = [];
        viewpoints.value = [];
        hasDateError.value = false;
        loading.value = false;
      } else {
        hasError.value = true;
      }
    };

    return {
      loading,
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
      viewpoints,
      removeViewpoint,
      submit,
      upload
    };
  }
};
</script>

<style scoped lang="scss" src="./CreateBcfTopic.scss"></style>
