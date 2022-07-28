<template>
  <div class="user-card-action-menu" v-click-away="closeMenu">
    <BIMDataButton
      data-test-id="btn-toggle-menu"
      class="user-card-action-menu__btn"
      color="default"
      ripple
      rounded
      icon
      @click="toggleMenu"
    >
      <BIMDataIcon
        :name="showMenu ? 'close' : 'ellipsis'"
        :size="showMenu ? 'xxs' : 'l'"
      />
    </BIMDataButton>

    <transition name="fade">
      <div class="user-card-action-menu__container" v-show="showMenu">
        <BIMDataButton
          data-test-id="btn-open-update"
          ghost
          rounded
          icon
          @click="$emit('open-update')"
        >
          <BIMDataIcon name="edit" size="xxs" />
        </BIMDataButton>
        <BIMDataButton
          data-test-id="btn-open-delete"
          ghost
          rounded
          icon
          @click="$emit('open-delete')"
        >
          <BIMDataIcon name="delete" size="xxs" />
        </BIMDataButton>
      </div>
    </transition>
  </div>
</template>

<script>
import { useToggle } from "@/composables/toggle";

export default {
  emits: ["open-update", "open-delete"],
  setup() {
    const {
      isOpen: showMenu,
      close: closeMenu,
      toggle: toggleMenu
    } = useToggle();

    return {
      // References
      showMenu,
      // Methods
      closeMenu,
      toggleMenu
    };
  }
};
</script>

<style scoped lang="scss" src="./UserCardActionMenu.scss"></style>
