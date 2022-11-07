<template>
  <div data-test-id="versioning-main" class="versioning-main">
    <transition name="fade">
      <template v-if="isSafeZone">
        <div class="versioning-main__safe-zone">
          <VersioningSafeZone @close="onSafeZone" />
        </div>
      </template>
    </transition>
    <template v-if="loading">
      <BIMDataLoading
        :message="$t(`Versioning.loading.${loading}Message`)"
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
        <BIMDataButton
          :disabled="
            (!project.isAdmin && currentFolder.user_permission < 100) ||
            spaceSubInfo.remaining_total_size <= 0
          "
          data-test-id="btn-add-version"
          fill
          radius
          icon
          color="primary"
          width="100%"
          @click="
            fileUploadInput('file', event => addVersion(event.target.files))
          "
        >
          <BIMDataIcon
            name="close"
            size="xxxs"
            :rotate="45"
            margin="0 6px 0 0"
          />
          {{ $t("Versioning.AddVersion") }}
        </BIMDataButton>
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
          <template v-for="(doc, index) of allDocVersions" :key="doc.id">
            <VersioningDoc
              data-test-id="versioning-doc"
              :project="project"
              :document="doc"
              :headDocument="allDocVersions[0]"
              :isHead="index === 0"
              :isLast="index + 1 === allDocVersions.length"
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
import { useUpload } from "../../../../composables/upload.js";
import FileService from "../../../../services/FileService.js";
import { fileUploadInput } from "../../../../utils/upload.js";

// Components
import VersioningDoc from "../versioning-doc/VersioningDoc.vue";
import VersioningSafeZone from "../versioning-safe-zone/VersioningSafeZone.vue";

export default {
  components: {
    VersioningDoc,
    VersioningSafeZone
  },
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
  emits: ["file-uploaded", "close"],

  setup(props, { emit }) {
    const { projectFileUploader } = useUpload();

    const loading = ref(null);

    const addVersion = async files => {
      const handlers = {
        onUploadStart: () => (loading.value = "download"),
        onUploadComplete: async ({ response: newHeadVersion }) => {
          await getAllDocVersions(newHeadVersion);
          loading.value = null;
        }
      };
      const uploader = projectFileUploader(props.project, handlers);
      uploader.upload(files[0], null, allDocVersions.value[0].id);
    };

    const docToDelete = ref(null);
    const isSafeZone = ref(false);

    const onDelete = async document => {
      isSafeZone.value = true;
      docToDelete.value = document;
    };

    const onSafeZone = async isActionConfirmed => {
      if (isActionConfirmed) {
        loading.value = "delete";
        await FileService.deleteDocVersion(props.project, docToDelete.value);
        loading.value = null;
        const documentHistory = allDocVersions.value.find(
          version => version.id !== docToDelete.value.id
        );

        await getAllDocVersions(documentHistory);
      }
      isSafeZone.value = false;
      docToDelete.value = null;
    };

    const allDocVersions = ref(null);

    const getAllDocVersions = async currentDocument => {
      allDocVersions.value = await FileService.getDocumentVersions(
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
      fileUploadInput,
      addVersion,
      onSafeZone,
      onDelete
    };
  }
};
</script>

<style scoped lang="scss" src="./VersioningMain.scss"></style>
