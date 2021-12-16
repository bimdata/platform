<template>
  <FlippableCard
    data-test="group-card"
    class="group-card"
    :flipped="showMenu"
    v-click-away="closeMenu"
  >
    <template #front-face>
      <BIMDataCard @click="goToGroupBoard">
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
            @click.stop="openMenu"
          >
            <BIMDataIcon name="ellipsis" size="l" fill color="granite-light" />
          </BIMDataButton>
          <BIMDataIcon name="group" size="xxl" />
          <BIMDataTextBox class="group-card__title" :text="group.name" />
          <UserAvatarList
            class="group-card__avatars"
            :users="group.members"
            itemSize="72"
            itemGap="44"
          />
        </template>
      </BIMDataCard>
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
import { useRouter } from "vue-router";
import { useToggle } from "@/composables/toggle";
import routeNames from "@/router/route-names.js";
// Components
import FlippableCard from "@/components/generic/flippable-card/FlippableCard";
import UserAvatarList from "@/components/specific/users/user-avatar-list/UserAvatarList";
import GroupCardActionMenu from "./group-card-action-menu/GroupCardActionMenu";

export default {
  components: {
    FlippableCard,
    UserAvatarList,
    GroupCardActionMenu
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
  setup(props) {
    const router = useRouter();
    const { isOpen: showMenu, open: openMenu, close: closeMenu } = useToggle();

    const goToGroupBoard = () => {
      router.push({
        name: routeNames.groupBoard,
        params: {
          spaceID: props.project.cloud.id,
          projectID: props.project.id,
          groupID: props.group.id
        }
      });
    };

    return {
      // References
      showMenu,
      // Methods
      closeMenu,
      goToGroupBoard,
      openMenu
    };
  }
};
</script>

<style scoped lang="scss" src="./GroupCard.scss"></style>
