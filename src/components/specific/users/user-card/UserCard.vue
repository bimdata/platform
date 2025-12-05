<template>
  <div data-test-id="user-card" class="user-card" v-click-away="resetCard">
    <transition name="fade" mode="out-in">
      <template v-if="loading">
        <div class="user-card__loader">
          <BIMDataSpinner />
        </div>
      </template>

      <template v-else-if="showUpdateForm">
        <UserCardUpdateForm
          :user="user"
          :space="space"
          :project="project"
          @close="closeUpdateForm"
        />
      </template>

      <template v-else-if="showDeleteGuard">
        <UserCardDeleteGuard
          :user="user"
          :space="space"
          :project="project"
          @close="closeDeleteGuard"
        />
      </template>

      <template v-else>
        <div class="user-card__content">
          <UserAvatar :user="user" size="42" color="silver-light" />
          <div class="user-card__content__info">
            <div class="user-card__content__info__name">
              <BIMDataTextbox
                width="auto"
                maxWidth="220px"
                :text="fullName(user) + (isSelf(user) ? ` (${$t('UserCard.self')})` : '')"
              />
              <UserRoleBadge
                :role="role"
                :cloudRole="cloudRole"
                :projectRole="projectRole"
                :isSpaceRole="user.in_all_projects"
              />
            </div>
            <div class="user-card__content__info__email">
              {{ user.email }}
            </div>
          </div>
          <UserCardActionMenu
            v-if="showActionMenu"
            @open-update="openUpdateForm"
            @open-delete="openDeleteGuard"
          />
        </div>
      </template>
    </transition>
  </div>
</template>

<script>
import { computed, provide, ref } from "vue";
import { useToggle } from "../../../../composables/toggle.js";
import { useUser } from "../../../../state/user.js";
import { fullName } from "../../../../utils/users.js";
// Components
import UserAvatar from "../user-avatar/UserAvatar.vue";
import UserRoleBadge from "../user-role-badge/UserRoleBadge.vue";
import UserCardActionMenu from "./user-card-action-menu/UserCardActionMenu.vue";
import UserCardDeleteGuard from "./user-card-delete-guard/UserCardDeleteGuard.vue";
import UserCardUpdateForm from "./user-card-update-form/UserCardUpdateForm.vue";

export default {
  components: {
    UserAvatar,
    UserRoleBadge,
    UserCardActionMenu,
    UserCardDeleteGuard,
    UserCardUpdateForm,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
    space: {
      type: Object,
      default: null,
    },
    project: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    const { isSelf, isSpaceAdmin, isProjectAdmin } = useUser();

    const showActionMenu = computed(() => {
      return !isSelf(props.user) && !isSpaceAdmin(props.space) && isProjectAdmin(props.project) && props.user.cloud_role !== 100;
    });
    const role = computed(() => (props.project ? props.user.role : props.user.cloud_role));
    const cloudRole = computed(() => props.user.cloud_role);
    const projectRole = computed(() => props.user.role);

    const loading = ref(false);
    provide("loading", loading);

    const { isOpen: showUpdateForm, open: openUpdateForm, close: closeUpdateForm } = useToggle();
    const { isOpen: showDeleteGuard, open: openDeleteGuard, close: closeDeleteGuard } = useToggle();

    const resetCard = () => {
      loading.value = false;
      closeUpdateForm();
      closeDeleteGuard();
    };

    return {
      // References
      loading,
      role,
      cloudRole,
      projectRole,
      showActionMenu,
      showDeleteGuard,
      showUpdateForm,
      // Methods
      closeDeleteGuard,
      closeUpdateForm,
      fullName,
      isSelf,
      openDeleteGuard,
      openUpdateForm,
      resetCard,
    };
  },
};
</script>

<style scoped lang="scss" src="./UserCard.scss"></style>
