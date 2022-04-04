<template>
  <FlippableCard
    data-test="group-card"
    class="group-card"
    :flipped="showMenu"
    v-click-away="closeMenu"
  >
    <template #front-face>
      <AppLink
        :to="{
          name: routeNames.groupBoard,
          params: {
            spaceID: project.cloud.id,
            projectID: project.id,
            groupID: group.id
          }
        }"
      >
        <BIMDataCard>
          <template #content>
            <div
              class="group-card__top-stripe"
              :style="{ backgroundColor: group.color }"
            ></div>
            <BIMDataButton
              v-if="actionMenu"
              class="group-card__btn-menu"
              ghost
              rounded
              icon
              @click.prevent.stop="openMenu"
            >
              <BIMDataIcon
                name="ellipsis"
                size="l"
                fill
                color="granite-light"
              />
            </BIMDataButton>
            <BIMDataIcon name="group" size="xxl" />
            <BIMDataTextbox class="group-card__title" :text="group.name" />
            <UserAvatarList
              class="group-card__avatars"
              :users="group.members"
              itemSize="72"
              itemGap="44"
            />
          </template>
        </BIMDataCard>
      </AppLink>
    </template>
    <template #back-face>
      <GroupCardActionMenu
        :project="project"
        :group="group"
        @close="closeMenu"
      />
    </template>
  </FlippableCard>
</template>

<script>
import { useToggle } from "@/composables/toggle.js";
import routeNames from "@/router/route-names.js";
// Components
import FlippableCard from "@/components/generic/flippable-card/FlippableCard.vue";
import AppLink from "@/components/specific/app/app-link/AppLink.vue";
import UserAvatarList from "@/components/specific/users/user-avatar-list/UserAvatarList.vue";
import GroupCardActionMenu from "./group-card-action-menu/GroupCardActionMenu.vue";

export default {
  components: {
    AppLink,
    FlippableCard,
    GroupCardActionMenu,
    UserAvatarList
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    group: {
      type: Object,
      required: true
    },
    actionMenu: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    const { isOpen: showMenu, open: openMenu, close: closeMenu } = useToggle();

    return {
      // References
      routeNames,
      showMenu,
      // Methods
      closeMenu,
      openMenu
    };
  }
};
</script>

<style scoped lang="scss" src="./GroupCard.scss"></style>
