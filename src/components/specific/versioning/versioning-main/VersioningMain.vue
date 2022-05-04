<template>
  <div class="versioning-main">
    <template v-if="loading">
      <BIMDataLoading
        :message="$t('Versioning.loading.message')"
        :subMessage="$t('Versioning.loading.subMessage')"
      />
    </template>
    <template v-else>
      <div class="versioning-main__content">
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
        <div class="versioning-main__content__list">
          <template v-for="(doc, index) of allDocVersions" :key="index">
            <VersioningList
              :project="project"
              :document="doc"
              :headDocument="headDocument"
              :isFirst="index === 0"
              :isLast="index + 1 === allDocVersions.length"
              @current-head="currentHead = $event"
              @model-created="$emit('model-created')"
            />
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { isEmpty } from "lodash";
import VersioningList from "@/components/specific/versioning/versioning-list/VersioningList.vue";
import FileUploadButton from "@/components/specific/files/file-upload-button/FileUploadButton.vue";

import { useUpload } from "@/composables/upload.js";

import { useFiles } from "@/state/files.js";

export default {
  components: { VersioningList, FileUploadButton },
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
    const { fetchAllPrevDocVersions } = useFiles();

    const allDocVersions = ref([]);
    const currentHead = ref(props.headDocument);
    const loading = ref(false);

    const addVersion = async fileToUpload => {
      if (fileToUpload) {
        const handlers = {
          onUploadStart: () => (loading.value = true),
          onUploadComplete: ({ response }) => {
            currentHead.value = response;
            loading.value = false;
          }
        };
        const uploader = projectFileUploader(props.project, handlers);
        uploader.upload(fileToUpload[0], null, currentHead.value.id);
      }
    };

    watch(
      currentHead,
      async () => {
        const prevDocVersions = await fetchAllPrevDocVersions(
          props.project,
          currentHead.value
        );
        if (!isEmpty(prevDocVersions)) {
          allDocVersions.value = [currentHead.value].concat(prevDocVersions);
          emit("file-uploaded", currentHead.value);
        }
      },
      { immediate: true }
    );

    return {
      //variable
      allDocVersions,
      currentHead,
      loading,
      //metthods
      addVersion
    };
  }
};
</script>

<style scoped lang="scss" src="./VersioningMain.scss"></style>
