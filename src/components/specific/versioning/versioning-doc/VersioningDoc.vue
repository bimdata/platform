<template>
  <div class="versioning-doc">
    <div class="versioning-doc__line">
      <div class="versioning-doc__line__outer-circle">
        <template v-if="isHead">
          <div class="versioning-doc__line__outer-circle__inner-circle"></div>
        </template>
      </div>
      <template v-if="!isLast">
        <div class="versioning-doc__line__down-line" />
      </template>
    </div>
    <div class="versioning-doc__content">
      <div class="versioning-doc__content__header">
        <div class="versioning-doc__content__header__left-side">
          <template v-if="isHead">
            <span> {{ $t("Versioning.currentVersion") }} </span>
          </template>
          <template v-else>
            <span> {{ $t("Versioning.previousVersion") }} </span>
          </template>
          <template v-if="!isEmpty(document.visas)">
            <BIMDataIconVisa
              :color="hasOneVisaClosed ? 'success' : 'granite'"
              size="s"
              fill
            />
          </template>
        </div>
        <div class="versioning-doc__content__header__right-side">
          <template v-if="isProjectAdmin(project)">
            <div
              class="versioning-doc__content__header__right-side__btn-delete"
            >
              <BIMDataTooltip position="left" :text="$t('t.delete')">
                <BIMDataButton
                  data-test-id="btn-delete-version"
                  ghost
                  rounded
                  icon
                  width="30px"
                  height="30px"
                  @click="$emit('on-delete', document)"
                >
                  <BIMDataIconDelete color="granite" size="xs" fill />
                </BIMDataButton>
              </BIMDataTooltip>
            </div>
          </template>
          <template v-if="!isHead">
            <div
              class="versioning-doc__content__header__right-side__btn-get-head"
            >
              <BIMDataTooltip
                position="left"
                :text="$t('Versioning.getToHead')"
              >
                <BIMDataButton
                  data-test-id="btn-get-to-head"
                  ghost
                  rounded
                  icon
                  width="30px"
                  height="30px"
                  @click="swapHeadDoc"
                >
                  <BIMDataIconRestore color="granite" size="xs" fill />
                </BIMDataButton>
              </BIMDataTooltip>
            </div>
          </template>
          <div class="versioning-doc__content__header__right-side__btn-dl">
            <BIMDataTooltip position="left" :text="$t('t.download')">
              <BIMDataButton
                ghost
                rounded
                icon
                width="30px"
                height="30px"
                @click="download(project, [document])"
              >
                <BIMDataIconDownload color="granite" size="xs" fill />
              </BIMDataButton>
            </BIMDataTooltip>
          </div>
          <template v-if="isViewable(document)">
            <div class="versioning-doc__content__header__right-side__btn-show">
              <BIMDataTooltip position="left" :text="$t('Versioning.show')">
                <AppLink
                  :to="{
                    name: routeNames.modelViewer,
                    params: {
                      spaceID: project.cloud.id,
                      projectID: project.id,
                      modelIDs: document.model_id
                    },
                    query: {
                      window: MODEL_CONFIG[document.model_type].window
                    }
                  }"
                >
                  <BIMDataButton ghost rounded icon width="30px" height="30px">
                    <BIMDataIconShow color="granite" size="xs" fill />
                  </BIMDataButton>
                </AppLink>
              </BIMDataTooltip>
            </div>
          </template>
          <template v-else-if="isPDF(document)">
            <div class="versioning-doc__content__header__right-side__btn-show">
              <BIMDataTooltip position="left" :text="$t('Versioning.show')">
                <BIMDataButton
                  ghost
                  rounded
                  icon
                  width="30px"
                  height="30px"
                  @click="convertToModelAndShow"
                >
                  <BIMDataIconShow color="granite" size="xs" fill />
                </BIMDataButton>
              </BIMDataTooltip>
            </div>
          </template>
        </div>
      </div>
      <div class="versioning-doc__content__file">
        <BIMDataFileIcon :fileName="document.file_name" :size="20" />
        <BIMDataTextbox
          class="versioning-doc__content__file__name"
          :text="document.name"
          width="calc(100% - 20px - 12px * 3)"
        />
      </div>
      <div class="versioning-doc__content__user">
        <div class="versioning-doc__content__user__title">
          {{ $t("Versioning.addedBy") }}
        </div>
        <div class="versioning-doc__content__user__info">
          <div class="versioning-doc__content__user__info__identity">
            <UserAvatar
              :user="document.created_by || {}"
              size="20"
              initialsSize="14"
              color="silver-light"
              style="box-shadow: var(--box-shadow)"
            />
            <BIMDataTextbox
              class="versioning-doc__content__user__info__identity__name"
              :text="
                (document.created_by &&
                  (fullName(document.created_by) ||
                    document.created_by.email)) ||
                ''
              "
              width="60%"
            />
          </div>
          <div class="versioning-doc__content__user__date">
            {{ $t("Versioning.titleDate") }}
            {{ $d(document.created_at, "long") }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import isEmpty from "lodash/isEmpty";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { MODEL_CONFIG } from "../../../../config/models.js";
import { VISA_STATUS } from "../../../../config/visa.js";
import routeNames from "../../../../router/route-names.js";
import FileService from "../../../../services/FileService.js";
import { useFiles } from "../../../../state/files.js";
import { useModels } from "../../../../state/models.js";
import { useUser } from "../../../../state/user.js";
import { isPDF, isViewable, openInViewer } from "../../../../utils/models.js";
import { fullName } from "../../../../utils/users.js";

// Components
import AppLink from "../../app/app-link/AppLink.vue";
import UserAvatar from "../../users/user-avatar/UserAvatar.vue";

export default {
  components: {
    AppLink,
    UserAvatar
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
    headDocument: {
      type: Object,
      required: true
    },
    isHead: {
      type: Boolean,
      required: true
    },
    isLast: {
      type: Boolean,
      required: true
    }
  },
  emits: ["on-delete", "get-all-doc-versions"],
  setup(props, { emit }) {
    const router = useRouter();
    const { isProjectAdmin } = useUser();
    const { createModel } = useModels();
    const { downloadFiles } = useFiles();

    const hasOneVisaClosed = computed(() =>
      props.document.visas.some(v => v.status === VISA_STATUS.CLOSE)
    );

    const swapHeadDoc = async () => {
      const newHeadVersion = await FileService.makeHeadVersion(
        props.project,
        props.headDocument,
        props.document
      );
      emit("get-all-doc-versions", newHeadVersion);
    };

    const convertToModelAndShow = async () => {
      const model = await createModel(props.project, props.document);
      openInViewer(router, props.project, model);
    };

    return {
      // References
      fullName,
      hasOneVisaClosed,
      MODEL_CONFIG,
      routeNames,
      // Methods
      convertToModelAndShow,
      download: downloadFiles,
      isEmpty,
      isPDF,
      isProjectAdmin,
      isViewable,
      swapHeadDoc
    };
  }
};
</script>

<style scoped lang="scss" src="./VersioningDoc.scss"></style>
