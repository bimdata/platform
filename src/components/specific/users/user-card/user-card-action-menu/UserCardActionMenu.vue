<template>
  <div class="user-card-action-menu" v-click-away="closeMenu">
    <BIMDataButton
      data-test="btn-toggle-menu"
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
        <!-- <BIMDataButton
          data-test="btn-open-update"
          ghost
          rounded
          icon
          @click="$emit('open-update')"
        >
          <BIMDataIcon name="edit" size="xxs" />
        </BIMDataButton> -->
        <BIMDataButton
          data-test="btn-open-delete"
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
import { ref } from "vue";

export default {
  emits: ["open-update", "open-delete"],
  setup() {
    const showMenu = ref(false);
    const closeMenu = () => {
      showMenu.value = false;
    };
    const toggleMenu = () => {
      showMenu.value = !showMenu.value;
    };

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
