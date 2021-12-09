<template>
  <div class="organization-card-action-menu">
    <BIMDataButton
      class="organization-card-action-menu__btn"
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
      <div class="organization-card-action-menu__container" v-show="showMenu">
        <BIMDataButton ghost rounded icon @click="$emit('update')">
          <BIMDataIcon name="edit" size="xxs" />
        </BIMDataButton>
        <BIMDataButton ghost rounded icon disabled @click="$emit('delete')">
          <BIMDataIcon name="delete" size="xxs" />
        </BIMDataButton>
      </div>
    </transition>
  </div>
</template>

<script>
import { useToggle } from "@/composables/toggle";

export default {
  emits: ["delete", "update"],
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

<style scoped lang="scss" src="./OrganizationCardActionMenu.scss"></style>
