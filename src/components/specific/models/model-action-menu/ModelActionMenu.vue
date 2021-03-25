<template>
  <div class="model-action-menu" v-click-away="closeMenu">
    <BIMDataButton
      class="model-action-menu__btn model-action-menu__btn--viewer"
      color="primary"
      outline
      radius
      icon
      :disabled="true"
      @click="() => {}"
    >
      2D
    </BIMDataButton>
    <BIMDataButton
      class="model-action-menu__btn model-action-menu__btn--viewer"
      color="primary"
      outline
      radius
      icon
      :disabled="true"
      @click="() => {}"
    >
      3D
    </BIMDataButton>
    <BIMDataButton
      class="model-action-menu__btn"
      ripple
      rounded
      icon
      @click="() => {}"
    >
      <BIMDataIcon name="cloud" size="s" />
    </BIMDataButton>
    <BIMDataButton
      class="model-action-menu__btn"
      ripple
      rounded
      icon
      @click="toggleMenu"
    >
      <BIMDataIcon name="ellipsis" size="l" />
    </BIMDataButton>

    <transition name="fade">
      <div class="model-action-menu__container" v-show="showMenu">
        <BIMDataButton class="model-action-menu__container__btn" ghost squared>
          {{ $t("ModelActionMenu.buttonAddTags") }}
        </BIMDataButton>
        <BIMDataButton class="model-action-menu__container__btn" ghost squared>
          {{ $t("ModelActionMenu.buttonRename") }}
        </BIMDataButton>
        <BIMDataButton class="model-action-menu__container__btn" ghost squared>
          {{ $t("ModelActionMenu.buttonArchive") }}
        </BIMDataButton>
        <BIMDataButton class="model-action-menu__container__btn" ghost squared>
          {{ $t("ModelActionMenu.buttonDelete") }}
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
    project: {
      type: Object,
      required: true
    },
    model: {
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

<style scoped lang="scss" src="./ModelActionMenu.scss"></style>
