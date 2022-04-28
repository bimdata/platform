<template>
  <div class="versioning-list">
    {{ console.log("document", document) }}
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
          <BIMDataIcon name="visa" color="success" size="s" fill />
        </div>
        <div class="versioning-list__content__header__right-side">
          <div
            class="versioning-list__content__header__right-side__btn-get-head"
          >
            <BIMDataButton ghost rounded icon width="30px" height="30px">
              <BIMDataIcon name="project" color="granite" size="xs" fill />
            </BIMDataButton>
          </div>
          <div class="versioning-list__content__header__right-side__btn-dl">
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
          </div>
          <template v-if="isViewable(document)">
            <div class="versioning-list__content__header__right-side__btn-show">
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
              :text="fullName(document.createdBy) || document.createdBy.email"
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
import UserAvatar from "@/components/specific/users/user-avatar/UserAvatar";
import { isViewable, windowType } from "@/utils/models.js";
import routeNames from "@/router/route-names.js";
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
    isFirst: {
      type: Boolean,
      required: true
    },
    isLast: {
      type: Boolean,
      required: true
    }
  },
  emits: [],
  setup() {
    const { downloadFiles } = useFiles();
    return {
      console,
      // references
      fullName,
      routeNames,
      // methods
      download: downloadFiles,
      isViewable,
      windowType
    };
  }
};
</script>

<style scoped lang="scss" src="./VersioningList.scss"></style>
