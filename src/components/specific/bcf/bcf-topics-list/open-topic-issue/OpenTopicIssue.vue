<template>
  <EditBcfTopic
    v-if="isOpenEditTopic"
    :bcfTopic="bcfTopic"
    @close="isOpenEditTopic = false"
  />
  <div v-else class="open-topic-issue">
    <div class="open-topic-issue__header flex items-center justify-between">
      <div
        class="
          open-topic-issue__header__title
          flex
          justify-center
          items-center
          p-x-6
        "
      >
        <BIMDataTextbox maxWidth="250px" :text="bcfTopic.title" />
      </div>
      <div
        class="
          open-topic-issue__header__actions
          flex
          justify-center
          items-center
        "
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
          <BIMDataIcon name="delete" fill color="default" size="xxs" />
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
        class="
          open-topic-issue__content__subheader
          flex
          items-center
          justify-between
          m-t-12
        "
      >
        <div
          class="
            open-topic-issue__content__subheader__index
            flex
            justify-center
            items-center
            p-x-6
          "
          :style="{
            'background-color': `#${priorityColor}`,
            color: adjustColor(`#${priorityColor}`, '#ffffff', '#2f374a'),
          }"
        >
          {{ bcfTopic.index }}
        </div>
        <div
          class="
            open-topic-issue__content__subheader__date
            flex
            justify-center
            items-center
          "
        >
          {{ $d(bcfTopic.creationDate, "short") }}
        </div>
      </div>
      <div
        class="open-topic-issue__content__img text-center m-t-12"
        :class="{
          'no-img': viewpointWithSnapshot.length === 0,
        }"
      >
        <div
          class="open-topic-issue__content__img__status flex p-6"
          :style="{
            'background-color': `#${statusColor}`,
            color: adjustColor(`#${statusColor}`, '#ffffff', '#2f374a'),
          }"
          v-if="bcfTopic.topicStatus"
        >
          <BIMDataIcon name="information" fill color="default" />
          <span class="m-l-6">{{ bcfTopic.topicStatus }}</span>
        </div>
        <div class="img-previews flex" v-if="viewpointWithSnapshot.length > 0">
          <div
            class="img-preview"
            v-for="viewpoint in viewpointWithSnapshot"
            :key="viewpoint.guid"
          >
            <img
              v-if="viewpoint.snapshot.snapshotData"
              :src="viewpoint.snapshot.snapshotData"
            />
          </div>
        </div>
        <NoImgTopicBcf class="no-img-topic" v-else />
      </div>
      <div>
        <template v-if="modelIDs.length > 0">
          <AppLink
            :to="{
              name: routeNames.modelViewer,
              params: {
                spaceID: currentProject.cloud.id,
                projectID: currentProject.id,
                modelIDs: modelIDs.join(','),
              },
              query: {
                topicGuid: bcfTopic.guid,
              },
            }"
          >
            <BIMDataButton width="100%" color="primary" fill radius>
              {{ $t("OpenTopicIssue.openViewer") }}
            </BIMDataButton>
          </AppLink>
        </template>
        <template v-else>
          <BIMDataTooltip :text="$t('OpenTopicIssue.openViewerNoModels')">
            <BIMDataButton width="100%" color="primary" fill radius disabled>
              {{ $t("OpenTopicIssue.openViewer") }}
            </BIMDataButton>
          </BIMDataTooltip>
        </template>
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
          <span class="color-granite">{{ topicTags }}</span>
        </div>
      </div>
      <div class="open-topic-issue__comment m-t-12">
        <BcfComments :bcfTopic="bcfTopic" />
      </div>
    </div>
    <SafeZoneModal v-if="deleteTopicModal">
      <template #text>
        {{ $t("ModalDeleteTopic.deleteText", { name: bcfTopic.title }) }}
      </template>
      <template #actions>
        <BIMDataButton
          color="high"
          fill
          radius
          class="m-r-12"
          @click="removeTopic"
        >
          {{ $t("ModalDeleteTopic.deleteBcfButton") }}
        </BIMDataButton>
        <BIMDataButton
          color="primary"
          outline
          radius
          @click="deleteTopicModal = false"
        >
          {{ $t("ModalDeleteTopic.keepBcfButton") }}
        </BIMDataButton>
      </template>
    </SafeZoneModal>
    <div v-if="loading">
      <BIMDataLoading />
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { adjustColor } from "@/components/specific/bcf/bcf-settings/adjustColor.js";
import { useBcf } from "@/state/bcf.js";
import { useProjects } from "@/state/projects.js";
import { useModels } from "@/state/models.js";

import NoImgTopicBcf from "../../../../images/NoImgTopicBcf.vue";
import EditBcfTopic from "@/components/specific/bcf/edit-bcf-topic/EditBcfTopic.vue";
import BcfComments from "@/components/specific/bcf/bcf-comments/BcfComments.vue";
import SafeZoneModal from "@/components/generic/safe-zone-modal/SafeZoneModal.vue";
import AppLink from "@/components/specific/app/app-link/AppLink.vue";
import routeNames from "@/router/route-names.js";
import { MODEL_TYPE, MODEL_STATUS } from "@/config/models";

export default {
  components: {
    EditBcfTopic,
    NoImgTopicBcf,
    BcfComments,
    SafeZoneModal,
    AppLink,
  },
  props: {
    bcfTopic: {
      type: Object,
      required: true,
    },
    detailedExtensions: {
      type: Object,
      required: true,
    },
  },
  emits: ["close"],
  setup(props) {
    const { t } = useI18n();
    const { currentProject } = useProjects();
    const { deleteTopic } = useBcf();
    const { projectModels } = useModels();

    const viewpointWithSnapshot = computed(() => {
      return props.bcfTopic.viewpoints.filter((viewpoint) =>
        Boolean(viewpoint.snapshot)
      );
    });

    const priorityColor = computed(() => {
      if (props.bcfTopic.priority) {
        const priorityDetail = props.detailedExtensions.priorities.find(
          (priority) => priority.priority === props.bcfTopic.priority
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
          (status) => status.topicStatus === props.bcfTopic.topicStatus
        );
        if (statusDetail && statusDetail.color) {
          return statusDetail.color;
        }
      }
      return "";
    });

    const deleteTopicModal = ref(false);
    const isOpenEditTopic = ref(false);
    const loading = ref(false);

    const removeTopic = async () => {
      try {
        loading.value = true;
        await deleteTopic(currentProject.value, props.bcfTopic);
      } finally {
        loading.value = false;
      }
    };

    const topicElements = computed(() => {
      if (
        props.bcfTopic.components &&
        props.bcfTopic.components.length > 0 &&
        props.bcfTopic.components[0]?.selection
      ) {
        return props.bcfTopic.components[0].selection;
      } else {
        return [];
      }
    });

    const topicTags = computed(() => {
      if (props.bcfTopic.labels && props.bcfTopic.labels.length) {
        return Array.from(props.bcfTopic.labels)
          .sort((a, b) => (a > b ? 1 : -1))
          .join(", ");
      } else {
        return t("OpenTopicIssue.noTags");
      }
    });

    const modelIDs = computed(() => {
      let ids = [];
      if (props.bcfTopic.ifcs && props.bcfTopic.ifcs.length) {
        ids = props.bcfTopic.ifcs;
      } else {
        const ifcs = projectModels.value
          .filter((model) => model.type === MODEL_TYPE.IFC)
          .filter((model) => model.status === MODEL_STATUS.COMPLETED)
          .sort((a, b) =>
            a.createdAt.getTime() > b.createdAt.getTime() ? 1 : -1
          );
        if (ifcs.length > 0) {
          ids.push(ifcs[0]);
        }
      }
      return ids;
    });

    return {
      viewpointWithSnapshot,
      deleteTopicModal,
      isOpenEditTopic,
      priorityColor,
      statusColor,
      topicElements,
      topicTags,
      adjustColor,
      loading,
      removeTopic,
      routeNames,
      currentProject,
      modelIDs,
    };
  },
};
</script>

<style scoped lang="scss" src="./OpenTopicIssue.scss"></style>
