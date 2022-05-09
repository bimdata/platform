<template>
  <div class="versioning-main">
    <transition name="fade">
      <template v-if="isSafeZone">
        <div class="versioning-main__safe-zone">
          <VersioningSafeZone @close="onSafeZone" />
        </div>
      </template>
    </transition>
    <template v-if="loading">
      <BIMDataLoading
        :message="$t('Versioning.loading.message')"
        :subMessage="$t('Versioning.loading.subMessage')"
      />
    </template>
    <div class="versioning-main__content" :class="{ safeZone: isSafeZone }">
      <div class="versioning-main__content__header">
        <div class="versioning-main__content__header__left-side">
          <BIMDataIcon
            name="versioning"
            fill
            color="primary"
            size="s"
            margin="2.5px 0 0 0"
          />
          <span>{{ $t("Versioning.title") }}</span>
        </div>
        <div class="versioning-main__content__header__right-side">
          <BIMDataButton ghost rounded icon @click="$emit('close')">
            <BIMDataIcon name="close" size="xxs" fill color="granite-light" />
          </BIMDataButton>
        </div>
      </div>

      <div class="versioning-main__content__add-version">
        <FileUploadButton
          :disabled="
            (!project.isAdmin && currentFolder.userPermission < 100) ||
            spaceSubInfo.remainingTotalSize <= 0
          "
          width="100%"
          icon="close"
          iconSize="xxxs"
          :iconRotate="45"
          :textButton="$t('Versioning.AddVersion')"
          @upload="addVersion"
        />
      </div>
      <template v-if="hasPrevVersions === false">
        <div class="versioning-main__content__empty-area">
          <div class="versioning-main__content__empty-area__info">
            <img src="/static/versioning/versioning-empty-history.svg" />
            <span>{{ $t("Versioning.emptyArea") }}</span>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="versioning-main__content__list">
          <template v-for="(doc, index) of allDocVersions" :key="index">
            <VersioningList
              :project="project"
              :document="doc"
              :headDocument="currentHead"
              :isHead="index === 0"
              :isLast="index + 1 === allDocVersions.length"
              @current-head="currentHead = $event"
              @on-delete="onDelete"
              @model-created="$emit('model-created')"
            />
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { isEmpty } from "lodash";

import VersioningList from "@/components/specific/versioning/versioning-list/VersioningList.vue";
import FileUploadButton from "@/components/specific/files/file-upload-button/FileUploadButton.vue";
import VersioningSafeZone from "@/components/specific/versioning/versioning-safe-zone/VersioningSafeZone.vue";

import { useUpload } from "@/composables/upload.js";
import { toCamelCaseFields } from "@/utils/misc";
import { useFiles } from "@/state/files.js";

export default {
  components: { VersioningList, VersioningSafeZone, FileUploadButton },
  props: {
    project: {
      type: Object,
      required: true
    },
    currentFolder: {
      type: Object,
      required: true
    },
    spaceSubInfo: {
      type: Object,
      required: true
    },
    headDocument: {
      type: Object,
      required: true
    }
  },
  emits: ["close", "model-created", "file-uploaded"],

  setup(props, { emit }) {
    const { projectFileUploader } = useUpload();
    const {
      fetchAllPrevDocVersions,
      deletePrevDocVersion,
      deleteHeadDocVersion
    } = useFiles();

    const currentHead = ref(props.headDocument);
    const loading = ref(false);

    const addVersion = async fileToUpload => {
      if (fileToUpload) {
        const handlers = {
          onUploadStart: () => (loading.value = true),
          onUploadComplete: ({ response }) => {
            currentHead.value = toCamelCaseFields(response);
            loading.value = false;
          }
        };
        const uploader = projectFileUploader(props.project, handlers);
        uploader.upload(fileToUpload[0], null, currentHead.value.id);
      }
    };

    const safeZoneAction = ref(null);
    const isSafeZone = ref(false);

    const onDelete = document => {
      isSafeZone.value = true;
      if (document.isHead) {
        safeZoneAction.value = async () => {
          await deleteHeadDocVersion(props.project, document);
          currentHead.value = allDocVersions.value[1];
        };
      } else {
        safeZoneAction.value = async () => {
          await deletePrevDocVersion(
            props.project,
            currentHead.value,
            document
          );
          await getAllDocVersions();
        };
      }
    };

    const onSafeZone = async isActionConfirmed => {
      if (isActionConfirmed) {
        await safeZoneAction.value();
      }
      isSafeZone.value = false;
      safeZoneAction.value = null;
    };

    const allDocVersions = ref(null);
    const hasPrevVersions = ref(undefined);

    const getAllDocVersions = async () => {
      const prevDocVersions = await fetchAllPrevDocVersions(
        props.project,
        currentHead.value
      );

      if (isEmpty(prevDocVersions)) {
        hasPrevVersions.value = false;
      } else {
        allDocVersions.value = [currentHead.value].concat(prevDocVersions);
        hasPrevVersions.value = true;
      }
      emit("file-uploaded", currentHead.value);
    };

    watch(currentHead, async () => await getAllDocVersions(), {
      immediate: true
    });

    return {
      // references
      loading,
      isSafeZone,
      currentHead,
      allDocVersions,
      hasPrevVersions,
      // methods
      getAllDocVersions,
      addVersion,
      onSafeZone,
      onDelete,
      isEmpty
    };
  }
};
</script>

<style scoped lang="scss" src="./VersioningMain.scss"></style>
