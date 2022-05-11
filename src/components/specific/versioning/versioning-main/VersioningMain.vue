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
            <VersioningDoc
              :project="project"
              :document="doc"
              :headDocument="allDocVersions[0]"
              :isHead="index === 0"
              :isLast="index + 1 === allDocVersions.length"
              @current-head="currentHead = $event"
              @on-delete="onDelete"
              @get-all-doc-versions="getAllDocVersions"
            />
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";

import { useFiles } from "@/state/files.js";
import { toCamelCaseFields } from "@/utils/misc";
import { useUpload } from "@/composables/upload.js";

import VersioningDoc from "@/components/specific/versioning/versioning-doc/VersioningDoc.vue";
import FileUploadButton from "@/components/specific/files/file-upload-button/FileUploadButton.vue";
import VersioningSafeZone from "@/components/specific/versioning/versioning-safe-zone/VersioningSafeZone.vue";

export default {
  components: { VersioningDoc, VersioningSafeZone, FileUploadButton },
  props: {
    project: {
      type: Object,
      required: true
    },
    document: {
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
    }
  },
  emits: ["close", "model-created", "file-uploaded"],

  setup(props, { emit }) {
    const { projectFileUploader } = useUpload();
    const { getDocumentVersions, deleteDocVersion } = useFiles();

    const loading = ref(false);

    const addVersion = async fileToUpload => {
      if (fileToUpload) {
        const handlers = {
          onUploadStart: () => (loading.value = true),
          onUploadComplete: async ({ response: newHeadVersion }) => {
            await getAllDocVersions(toCamelCaseFields(newHeadVersion));
            loading.value = false;
          }
        };
        const uploader = projectFileUploader(props.project, handlers);
        uploader.upload(fileToUpload[0], null, allDocVersions.value[0].id);
      }
    };

    const safeZoneAction = ref(null);
    const isSafeZone = ref(false);

    const onDelete = async document => {
      isSafeZone.value = true;
      safeZoneAction.value = async () => {
        await deleteDocVersion(props.project, document);
        const documentHistory = allDocVersions.value.find(
          version => version.id !== document.id
        );
        await getAllDocVersions(documentHistory);
      };
    };

    const onSafeZone = async isActionConfirmed => {
      if (isActionConfirmed) {
        await safeZoneAction.value();
      }
      isSafeZone.value = false;
      safeZoneAction.value = null;
    };

    const allDocVersions = ref(null);

    const getAllDocVersions = async currentDocument => {
      allDocVersions.value = await getDocumentVersions(
        props.project,
        currentDocument
      );
      emit("file-uploaded", allDocVersions.value[0]);
    };

    const hasPrevVersions = computed(() => {
      if (!allDocVersions.value) {
        return undefined;
      } else {
        return allDocVersions.value.length > 1 ? true : false;
      }
    });

    onMounted(async () => await getAllDocVersions(props.document));

    return {
      // references
      loading,
      isSafeZone,
      allDocVersions,
      hasPrevVersions,
      getAllDocVersions,
      // methods
      addVersion,
      onSafeZone,
      onDelete
    };
  }
};
</script>

<style scoped lang="scss" src="./VersioningMain.scss"></style>
