<template>
  <div class="visa-comments-list-actions" v-click-away="closeMenu">
    <div style="display: flex">
      <template v-if="showMenu && !isEditing && !isDeleting">
        <BIMDataButton
          ghost
          rounded
          icon
          @click="$emit('handle-edit', commentId)"
        >
          <BIMDataIcon name="edit" size="xxs" fill color="granite-light" />
        </BIMDataButton>
        <BIMDataButton
          ghost
          rounded
          icon
          @click="$emit('handle-delete', commentId)"
        >
          <BIMDataIcon name="delete" size="xxs" fill color="granite-light" />
        </BIMDataButton>
        <BIMDataButton ghost rounded icon @click="toggleMenu">
          <BIMDataIcon name="close" size="xxs" fill color="granite-light" />
        </BIMDataButton>
      </template>
      <template
        v-if="
          (isEditing || isDeleting) &&
          commentToHandle &&
          commentToHandle.id === commentId
        "
      >
        <BIMDataButton ghost rounded icon @click="onAction('cancel')">
          <BIMDataIcon name="undo" size="xxs" fill color="granite-light" />
        </BIMDataButton>
        <BIMDataButton ghost rounded icon @click="onAction(commentId)">
          <BIMDataIcon name="validate" size="xxs" fill color="granite-light" />
        </BIMDataButton>
      </template>
      <BIMDataButton
        v-show="!showMenu && !isEditing && !isDeleting"
        class="visa-comments-list-actions__btn"
        rounded
        icon
        @click="toggleMenu"
      >
        <BIMDataIcon name="ellipsis" size="l" />
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import { useToggle } from "@/composables/toggle.js";

export default {
  components: {},
  props: {
    commentId: {
      type: Number
    },
    commentToHandle: {
      type: Object
    },
    isEditing: {
      type: Boolean,
      required: true
    },
    isDeleting: {
      type: Boolean,
      required: true
    }
  },
  emits: ["handle-edit", "handle-delete"],
  setup(props, { emit }) {
    const {
      isOpen: showMenu,
      close: closeMenu,
      toggle: toggleMenu
    } = useToggle();

    const onAction = payload => {
      emit(props.isEditing ? "handle-edit" : "handle-delete", payload);
      toggleMenu();
    };

    return {
      // references
      showMenu,
      // Methods
      closeMenu,
      toggleMenu,
      onAction
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaCommentsListActions.scss"></style>
