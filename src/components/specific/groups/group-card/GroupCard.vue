<template>
  <FlippableCard
    data-test="group-card"
    class="group-card"
    :flipped="showMenu"
    v-click-away="closeMenu"
  >
    <template #front-face>
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
            @click="openMenu"
          >
            <BIMDataIcon name="ellipsis" size="l" fill color="tertiary-dark" />
          </BIMDataButton>
          <BIMDataIcon name="group" size="xxl" />
          <TextBox
            class="group-card__title"
            :text="group.name"
            :maxLength="32"
          />
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
      <GroupCardActionMenu :group="group" @close="closeMenu" />
    </template>
  </FlippableCard>
</template>

<script>
import { useToggle } from "@/composables/toggle";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataCard from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataCard.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import FlippableCard from "@/components/generic/flippable-card/FlippableCard";
import TextBox from "@/components/generic/text-box/TextBox";
import UserAvatarList from "@/components/specific/users/user-avatar-list/UserAvatarList";
import GroupCardActionMenu from "./group-card-action-menu/GroupCardActionMenu";

export default {
  components: {
    BIMDataButton,
    BIMDataCard,
    BIMDataIcon,
    FlippableCard,
    TextBox,
    UserAvatarList,
    GroupCardActionMenu
  },
  props: {
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
      showMenu,
      // Methods
      closeMenu,
      openMenu
    };
  }
};
</script>

<style scoped lang="scss" src="./GroupCard.scss"></style>
