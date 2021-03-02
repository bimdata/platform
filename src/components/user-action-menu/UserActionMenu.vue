<template>
  <div class="user-action-menu" v-click-away="closeMenu">
    <BIMDataButton
      color="default"
      ripple
      rounded
      icon
      class="user-action-menu__btn"
      @click="toggleMenu"
    >
      <BIMDataIcon
        :name="showMenu ? 'close' : 'ellipsis'"
        :size="showMenu ? 'xxs' : 'l'"
      />
    </BIMDataButton>

    <transition name="fade">
      <div class="user-action-menu__container" v-show="showMenu">
        <BIMDataButton ghost rounded icon @click="() => {}">
          <BIMDataIcon name="edit" size="xxs" />
        </BIMDataButton>
        <BIMDataButton ghost rounded icon @click="() => {}">
          <BIMDataIcon name="delete" size="xxs" />
        </BIMDataButton>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref } from "vue";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
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

<style scoped lang="scss" src="./UserActionMenu.scss"></style>
