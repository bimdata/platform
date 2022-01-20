<template>
  <div class="visa-comments-list-actions" v-click-away="onClose">
    <div v-show="showMenu" style="display: flex">
      <BIMDataButton ghost rounded icon @click="onOpen('edit')">
        <BIMDataIcon name="edit" size="xxs" fill color="granite-light" />
      </BIMDataButton>
      <BIMDataButton ghost rounded icon @click="onOpen('delete')">
        <BIMDataIcon name="delete" size="xxs" fill color="granite-light" />
      </BIMDataButton>
      <BIMDataButton ghost rounded icon @click="toggleMenu">
        <BIMDataIcon name="close" size="xxs" fill color="granite-light" />
      </BIMDataButton>
    </div>
    <div v-show="isEditing" style="display: flex">
      <BIMDataButton ghost rounded icon @click="onAction('cancel')">
        <BIMDataIcon name="undo" size="xxs" fill color="granite-light" />
      </BIMDataButton>
      <BIMDataButton ghost rounded icon @click="onAction(commentId)">
        <BIMDataIcon name="validate" size="xxs" fill color="granite-light" />
      </BIMDataButton>
    </div>
    <div v-show="isDeleting" class="visa-comments-list-actions__delete">
      <span> {{ $t("Visa.comments.actions.confirmDelete") }}</span>
      <BIMDataButton fill radius color="high" @click="onAction(commentId)">
        {{ $t("Visa.comments.actions.delete") }}
      </BIMDataButton>
      <BIMDataButton ghost rounded icon @click="onAction('cancel')">
        <BIMDataIcon name="close" size="xxs" fill color="primary" />
      </BIMDataButton>
    </div>
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
</template>

<script>
import { ref } from "vue";
import { useToggle } from "@/composables/toggle.js";

export default {
  components: {},
  props: {
    commentId: {
      type: Number
    },
    commentToHandle: {
      type: Object
    }
  },
  emits: ["handle-edit", "handle-delete", "set-comment-to-handle"],
  setup(props, { emit }) {
    const {
      isOpen: showMenu,
      close: closeMenu,
      toggle: toggleMenu
    } = useToggle();

    const isEditing = ref(false);
    const isDeleting = ref(false);

    const onOpen = actionType => {
      if (actionType === "edit") {
        emit("handle-edit", props.commentId);
        isEditing.value = true;
      } else if (actionType === "delete") {
        emit("handle-delete", props.commentId);
        isDeleting.value = true;
      }
      closeMenu();
    };

    const onAction = payload => {
      if (isEditing.value) {
        emit("handle-edit", payload);
        isEditing.value = false;
      } else if (isDeleting.value) {
        emit("handle-delete", payload);
        isDeleting.value = false;
      }
    };

    const onClose = () => {
      if (isEditing.value === false && isDeleting.value === false) return;

      emit("handle-edit", "cancel");
      emit("handle-delete", "cancel");
      isEditing.value = false;
      isDeleting.value = false;
      closeMenu();
    };

    return {
      // references
      showMenu,
      isEditing,
      isDeleting,
      // Methods
      closeMenu,
      toggleMenu,
      onOpen,
      onAction,
      onClose,
      console
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaCommentsListActions.scss"></style>
