<template>
  <div class="visa-comments-list-actions" v-click-away="closeMenu">
    <BIMDataButton
      class="visa-comments-list-actions__btn"
      rounded
      icon
      @click="toggleMenu"
    >
      <BIMDataIcon name="ellipsis" size="l" />
    </BIMDataButton>
    <transition name="fade">
      <div class="visa-comments-list-actions__menu" v-show="showMenu">
        <BIMDataButton
          class="visa-comments-list-actions__menu__btn"
          ghost
          squared
          @click="onEdit"
        >
          {{ $t("Visa.comments.actions.edit") }}
        </BIMDataButton>
        <BIMDataButton
          class="visa-comments-list-actions__menu__btn"
          ghost
          squared
          @click="onDelete"
        >
          {{ $t("Visa.comments.actions.delete") }}
        </BIMDataButton>
      </div>
    </transition>
  </div>
</template>

<script>
import { useToggle } from "@/composables/toggle.js";

export default {
  components: {},
  props: {
    commentId: {
      type: Number
    }
  },
  emits: ["handle-edit", "handle-delete"],
  setup(props, { emit }) {
    const {
      isOpen: showMenu,
      close: closeMenu,
      toggle: toggleMenu
    } = useToggle();

    const onDelete = () => {
      emit("handle-delete", props.commentId);
      closeMenu();
    };

    const onEdit = () => {
      emit("handle-edit", props.commentId);
      closeMenu();
    };
    return {
      // references
      showMenu,
      // Methods
      closeMenu,
      toggleMenu,
      onDelete,
      onEdit
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaCommentsListActions.scss"></style>
