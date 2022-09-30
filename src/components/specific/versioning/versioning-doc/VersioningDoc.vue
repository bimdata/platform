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
            <BIMDataIcon
              name="visa"
              :color="hasOneVisaClosed ? 'success' : 'granite'"
              size="s"
              fill
            />
          </template>
        </div>
        <div class="versioning-doc__content__header__right-side">
          <template v-if="project.isAdmin">
            <div
              class="versioning-doc__content__header__right-side__btn-delete"
            >
              <BIMDataTooltip position="left" :text="$t('Versioning.delete')">
                <BIMDataButton
                  ghost
                  rounded
                  icon
                  width="30px"
                  height="30px"
                  @click="$emit('on-delete', document)"
                >
                  <BIMDataIcon name="delete" color="granite" size="xs" fill />
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
          <div class="versioning-doc__content__header__right-side__btn-dl">
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
                      window: windowType(document)
                    }
                  }"
                >
                  <BIMDataButton ghost rounded icon width="30px" height="30px">
                    <BIMDataIcon name="show" color="granite" size="xs" fill />
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
                  <BIMDataIcon name="show" color="granite" size="xs" fill />
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
import { isEmpty } from "lodash";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { VISA_STATUS } from "../../../../config/visa.js";
import routeNames from "../../../../router/route-names.js";
import FileService from "../../../../services/FileService.js";
import { useFiles } from "../../../../state/files.js";
import { useModels } from "../../../../state/models.js";
import { isViewable, isPDF, windowType } from "../../../../utils/models.js";
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
    const { downloadFiles } = useFiles();
    const { createModel } = useModels();
    const router = useRouter();

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
      router.push({
        name: routeNames.modelViewer,
        params: {
          spaceID: props.project.cloud.id,
          projectID: props.project.id,
          modelIDs: model.document.model_id
        },
        query: {
          window: windowType(model.document)
        }
      });
    };

    return {
      // references
      fullName,
      routeNames,
      hasOneVisaClosed,
      // methods
      download: downloadFiles,
      convertToModelAndShow,
      swapHeadDoc,
      isViewable,
      windowType,
      isEmpty,
      isPDF
    };
  }
};
</script>

<style scoped lang="scss" src="./VersioningDoc.scss"></style>
