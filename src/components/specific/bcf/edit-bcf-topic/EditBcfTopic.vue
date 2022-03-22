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
      <span class="text-center">
        <BIMDataTextbox maxWidth="80%" :text="bcfTopic.title" />
      </span>
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
        :class="{
          'no-img': viewpointWithSnapshot.length === 0
        }"
      >
        <div class="img-previews flex" v-if="viewpointWithSnapshot.length > 0">
          <div
            class="img-preview"
            v-for="viewpoint in viewpointWithSnapshot.slice(0, 4)"
            :key="viewpoint.guid"
          >
            <img
              v-if="viewpoint.snapshot.snapshotData"
              :src="viewpoint.snapshot.snapshotData"
            />
            <BIMDataButton
              color="default"
              fill
              rounded
              icon
              @click="removeViewpoint(viewpoint)"
              class="remove-viewpoint"
            >
              <BIMDataIcon name="delete" size="xs" fill color="high" />
            </BIMDataButton>
          </div>
        </div>
        <div class="img-input flex flex-col items-center justify-center" v-else>
          <span class="flex items-center justify-center">
            <BIMDataIcon name="unarchive" fill color="default" size="m" />
          </span>
          <BIMDataButton color="primary" outline radius class="m-t-18">
            <label for="files">
              {{ $t("EditBcfTopic.dragDropImageText") }}</label
            >
            <input
              type="file"
              accept="image/png, image/jpeg"
              multiple
              @change="upload"
              id="files"
              style="display: none"
            />
          </BIMDataButton>
        </div>
      </div>
      <div
        class="edit-bcf-topic__content__add-img flex justify-center m-t-18"
        v-if="viewpoints.length > 0 || bcfTopic.viewpoints.length > 0"
      >
        <BIMDataButton
          width="100%"
          color="primary"
          fill
          radius
          :disabled="viewpointWithSnapshot.length >= 4"
        >
          <input
            type="file"
            accept="image/png, image/jpeg"
            multiple
            @change="upload"
            id="files"
            style="display: none"
            :disabled="viewpointWithSnapshot.length >= 4"
          />
          <label
            for="files"
            class="flex items-center justify-center"
            :disabled="viewpointWithSnapshot.length >= 4"
          >
            <BIMDataIcon name="camera" size="xs" margin="0 12px 0 0" />
            {{ $t("EditBcfTopic.addPictureButton") }}
          </label>
        </BIMDataButton>
      </div>

      <div class="edit-bcf-topic__content__content m-t-36">
        <BIMDataInput
          :placeholder="$t('EditBcfTopic.titlePlaceholder')"
          v-model="topicTitle"
          :errorMessage="$t('EditBcfTopic.titleErrorMessage')"
        />
        <BIMDataSelect
          width="100%"
          :label="$t('EditBcfTopic.typeLabel')"
          :options="extensions.topicType"
          v-model="topicType"
        />
        <BIMDataSelect
          width="100%"
          :label="$t('EditBcfTopic.priorityLabel')"
          :options="extensions.priority"
          v-model="topicPriority"
        />
        <BIMDataSelect
          width="100%"
          :label="$t('EditBcfTopic.statusLabel')"
          :options="extensions.topicStatus"
          v-model="topicStatus"
        />
        <BIMDataSelect
          width="100%"
          :label="$t('EditBcfTopic.stageLabel')"
          :options="extensions.stage"
          v-model="topicPhase"
        />
        <BIMDataSelect
          width="100%"
          :label="$t('EditBcfTopic.assignedToLabel')"
          :options="extensions.userIdType"
          v-model="topicAssignedTo"
        />
        <div class="due-date m-b-30">
          <BIMDataInput
            margin="0"
            v-model="topicDate"
            :placeholder="$t('CreateBcfTopic.dueDateLabel')"
            :error="hasDateError"
            :errorMessage="$t('CreateBcfTopic.dateErrorMessage')"
          />
          <p class="m-y-6">{{ $t("CreateBcfTopic.dateExample") }}</p>
        </div>
        <BIMDataTextarea
          :label="$t('EditBcfTopic.descriptionLabel')"
          name="description"
          v-model="topicDescription"
          width="100%"
          fitContent
          resizable
        />
        <TagsInput v-model="topicTags" class="m-t-24" />
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
import { ref, watch, computed } from "vue";

import { useI18n } from "vue-i18n";
import { useBcf } from "@/state/bcf.js";
import { useProjects } from "@/state/projects.js";
import { formatToDateObject, regexDate, formatDate } from "@/utils/date";

import EditBcfTopicModal from "./edit-bcf-topic-modal/EditBcfTopicModal.vue";
import TagsInput from "../create-bcf-topic/tags-input/TagsInput.vue";

import _ from "lodash";

export default {
  components: {
    EditBcfTopicModal,
    TagsInput
  },
  props: {
    bcfTopic: {
      type: Object,
      required: true
    }
  },
  emits: ["close"],
  setup(props, { emit }) {
    const viewpointWithSnapshot = computed(() => {
      return props.bcfTopic.viewpoints.filter(viewpoint =>
        Boolean(viewpoint.snapshot)
      );
    });

    const { d } = useI18n();

    const { extensions, updateTopic, deleteViewpoint } = useBcf();
    const topicTitle = ref("");
    const topicType = ref("");
    const topicPriority = ref("");
    const topicStatus = ref("");
    const topicPhase = ref("");
    const topicDate = ref("");
    const topicAssignedTo = ref("");
    const topicDescription = ref("");
    const topicTags = ref([]);
    const hasDateError = ref(false);
    const viewpointsToDelete = ref([]);

    const viewpoints = ref(props.bcfTopic.viewpoints);
    const upload = event => {
      [...event.target.files].forEach(file => {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          viewpoints.value.push({
            snapshot: {
              snapshotType: file.type,
              snapshotData: reader.result
            }
          });
        });
        reader.readAsDataURL(file);
      });
    };
    const removeViewpoint = viewpoint => {
      viewpointsToDelete.value.push(viewpoint);
      const index = viewpoints.value.indexOf(viewpoint);
      viewpoints.value.splice(index, 1);
    };

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
        if (props.bcfTopic.dueDate) {
          topicDate.value = d(props.bcfTopic.dueDate);
        } else {
          topicDate.value = null;
        }
        if (props.bcfTopic.description) {
          topicDescription.value = props.bcfTopic.description;
        } else {
          topicDescription.value = null;
        }
        if (props.bcfTopic.labels) {
          topicTags.value = props.bcfTopic.labels;
        } else {
          topicTags.value = [];
        }
        if (props.bcfTopic.viewpoints) {
          viewpoints.value = props.bcfTopic.viewpoints;
        } else {
          viewpoints.value = [];
        }
      },
      { immediate: true }
    );

    const { currentProject } = useProjects();
    const loading = ref(false);

    const snakeify = obj =>
      _.transform(obj, (acc, value, key, target) => {
        const snakeKey = _.isArray(target) ? key : _.snakeCase(key);
        acc[snakeKey] =
          _.isObject(value) && !_.isDate(value) ? snakeify(value) : value;
      });

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

    const updateBcfTopic = async () => {
      if (!isDateConform(topicDate)) {
        hasDateError.value = true;
        return;
      }
      if (topicTitle.value && isDateConform(topicDate)) {
        loading.value = true;
        const viewpoints_json = viewpoints.value.map(viewpoint => {
          const viewpoint_json = { ...viewpoint };
          if ("snapshot" in viewpoint_json && !viewpoint.snapshot) {
            delete viewpoint_json.snapshot;
          }
          if (viewpoint.snapshot) {
            if (viewpoint_json.snapshot.snapshotData.startsWith("http")) {
              // If the viewpoint is an URL, it's not a new viewpoint and we don't want to update it
              delete viewpoint_json.snapshot;
            }
          }
          return viewpoint_json;
        });

        const body = {
          title: topicTitle.value,
          topicType: topicType.value,
          priority: topicPriority.value,
          topicStatus: topicStatus.value,
          stage: topicPhase.value,
          assignedTo: topicAssignedTo.value,
          description: topicDescription.value,
          labels: topicTags.value,
          viewpoints: viewpoints_json
        };
        if (topicDate.value) {
          body.dueDate = formatDate(topicDate.value);
        }
        if (viewpointsToDelete.value.length > 0) {
          await Promise.all(
            viewpointsToDelete.value.map(viewpoint =>
              deleteViewpoint(currentProject.value, props.bcfTopic, viewpoint)
            )
          );
        }
        await updateTopic(currentProject.value, props.bcfTopic, snakeify(body));
        loading.value = false;
      }
    };

    const openModal = ref(false);
    const goBack = () => {
      if (
        topicTitle.value !== props.bcfTopic.title ||
        topicType.value !== (props.bcfTopic.topicType || null) ||
        topicPriority.value !== (props.bcfTopic.priority || null) ||
        topicStatus.value !== (props.bcfTopic.topicStatus || null) ||
        topicPhase.value !== (props.bcfTopic.stage || null) ||
        topicAssignedTo.value !== (props.bcfTopic.assignedTo || null) ||
        topicDescription.value !== (props.bcfTopic.description || "" || null) ||
        viewpoints.value !== (props.bcfTopic.viewpoints || [])
      ) {
        openModal.value = true;
      } else {
        emit("close");
      }
    };

    return {
      viewpointWithSnapshot,
      loading,
      openModal,
      topicTitle,
      topicType,
      topicPriority,
      topicStatus,
      topicPhase,
      topicAssignedTo,
      topicDate,
      hasDateError,
      topicDescription,
      extensions,
      topicTags,
      viewpoints,
      // Methods
      updateBcfTopic,
      removeViewpoint,
      goBack,
      upload
    };
  }
};
</script>

<style scoped lang="scss" src="./EditBcfTopic.scss"></style>
