<template>
  <div class="versioning-list">
    <div class="versioning-list__line">
      <div class="versioning-list__line__outer-circle">
        <template v-if="isFirst">
          <div class="versioning-list__line__outer-circle__inner-circle"></div>
        </template>
      </div>
      <template v-if="!isLast">
        <div class="versioning-list__line__down-line" />
      </template>
    </div>
    <div class="versioning-list__content">
      <div class="versioning-list__content__header">
        <div class="versioning-list__content__header__left-side">
          <template v-if="isFirst">
            <span> {{ $t("Versioning.currentVersion") }} </span>
          </template>
          <template v-else>
            <span> {{ $t("Versioning.previousVersion") }} </span>
          </template>
          <!-- <BIMDataIcon name="visa" color="success" size="s" fill /> -->
        </div>
        {{ console.log("document", document) }}
        <div class="versioning-list__content__header__right-side">
          <template v-if="project.isAdmin">
            <div
              class="versioning-list__content__header__right-side__btn-delete"
            >
              <BIMDataTooltip position="left" :text="$t('Versioning.delete')">
                <BIMDataButton
                  ghost
                  rounded
                  icon
                  width="30px"
                  height="30px"
                  @click=""
                >
                  <BIMDataIcon name="delete" color="granite" size="xs" fill />
                </BIMDataButton>
              </BIMDataTooltip>
            </div>
          </template>
          <template v-if="!isFirst">
            <div
              class="versioning-list__content__header__right-side__btn-get-head"
            >
              <BIMDataTooltip
                position="left"
                :text="$t('Versioning.getToHead')"
              >
                <BIMDataButton
                  ghost
                  rounded
                  icon
                  width="30px"
                  height="30px"
                  @click="swapHeadDoc"
                >
                  <BIMDataIcon
                    name="backInTime"
                    color="granite"
                    size="xs"
                    fill
                  />
                </BIMDataButton>
              </BIMDataTooltip>
            </div>
          </template>
          <div class="versioning-list__content__header__right-side__btn-dl">
            <BIMDataTooltip position="left" :text="$t('Versioning.download')">
              <BIMDataButton
                ghost
                rounded
                icon
                width="30px"
                height="30px"
                @click="download(project, [document])"
              >
                <BIMDataIcon name="download" color="granite" size="xs" fill />
              </BIMDataButton>
            </BIMDataTooltip>
          </div>
          <template v-if="isViewable(document)">
            <div class="versioning-list__content__header__right-side__btn-show">
              <BIMDataTooltip position="left" :text="$t('Versioning.show')">
                <AppLink
                  :to="{
                    name: routeNames.modelViewer,
                    params: {
                      spaceID: project.cloud.id,
                      projectID: project.id,
                      modelIDs: document.modelId
                    },
                    query: {
                      window: windowType(document)
                    }
                  }"
                  target="_blank"
                >
                  <BIMDataButton ghost rounded icon width="30px" height="30px">
                    <BIMDataIcon name="show" color="granite" size="xs" fill />
                  </BIMDataButton>
                </AppLink>
              </BIMDataTooltip>
            </div>
          </template>
          <template v-else-if="isPDF(document.fileName)">
            <div class="versioning-list__content__header__right-side__btn-show">
              <BIMDataTooltip position="left" :text="$t('Versioning.show')">
                <BIMDataButton
                  ghost
                  rounded
                  icon
                  width="30px"
                  height="30px"
                  @click="convertAndShow"
                >
                  <BIMDataIcon name="show" color="granite" size="xs" fill />
                </BIMDataButton>
              </BIMDataTooltip>
            </div>
          </template>
        </div>
      </div>
      <div class="versioning-list__content__file">
        <BIMDataFileIcon :fileName="document.fileName" :size="20" />
        <BIMDataTextbox
          class="versioning-list__content__file__name"
          :text="document.name"
          width="calc(100% - 20px - 12px * 3)"
        />
      </div>
      <div class="versioning-list__content__user">
        <div class="versioning-list__content__user__title">
          {{ $t("Versioning.addedBy") }}
        </div>
        <div class="versioning-list__content__user__info">
          <div class="versioning-list__content__user__info__identity">
            <UserAvatar
              :user="document.createdBy || {}"
              size="20"
              initialsSize="14"
              color="silver-light"
              style="box-shadow: var(--box-shadow)"
            />
            <BIMDataTextbox
              class="versioning-list__content__user__info__identity__name"
              :text="
                (document.createdBy &&
                  (fullName(document.createdBy) || document.createdBy.email)) ||
                ''
              "
              width="60%"
            />
          </div>
          <div class="versioning-list__content__user__date">
            {{ $t("Versioning.titleDate") }}
            {{ $d(document.createdAt, "long") }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import UserAvatar from "@/components/specific/users/user-avatar/UserAvatar";
import { isViewable, isPDF, windowType } from "@/utils/models.js";
import routeNames from "@/router/route-names.js";
import { useModels } from "@/state/models.js";

import { useFiles } from "@/state/files.js";

import { fullName } from "@/utils/users";

import AppLink from "@/components/specific/app/app-link/AppLink.vue";

export default {
  components: { UserAvatar, AppLink },
  props: {
    project: {
      type: Object,
      required: true
    },
    document: {
      type: Object,
      required: true
    },
    headDocument: {
      type: Object,
      required: true
    },
    isFirst: {
      type: Boolean,
      required: true
    },
    isLast: {
      type: Boolean,
      required: true
    }
  },
  emits: ["current-head", "model-created"],
  setup(props, { emit }) {
    const { downloadFiles, makeHeadVersion, deleteDocVersion } = useFiles();
    const { createModel } = useModels();
    const router = useRouter();

    const swapHeadDoc = async () => {
      const newHeadVersion = await makeHeadVersion(
        props.project,
        props.headDocument,
        props.document
      );
      emit("current-head", newHeadVersion);
    };

    const deleteVersion = async () => {
      // await deleteDocVersion(props.project, props.headDocument, props.document);
    };

    const convertAndShow = async () => {
      const model = await createModel(props.project, props.document);
      const route = router.resolve({
        name: routeNames.modelViewer,
        params: {
          spaceID: props.project.cloud.id,
          projectID: props.project.id,
          modelIDs: model.document.modelId
        },
        query: {
          window: windowType(model.document)
        }
      });
      window.open(route.href, "_blank");
      emit("model-created", model);
    };

    return {
      // references
      fullName,
      routeNames,
      // methods
      makeHeadVersion,
      download: downloadFiles,
      convertAndShow,
      isPDF,
      swapHeadDoc,
      isViewable,
      windowType,
      console
    };
  }
};
</script>

<style scoped lang="scss" src="./VersioningList.scss"></style>
