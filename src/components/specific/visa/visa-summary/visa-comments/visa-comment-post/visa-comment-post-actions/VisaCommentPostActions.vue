<template>
  <div class="visa-comment-post-actions">
    <div style="display: flex">
      <template v-if="showMenu">
        <BIMDataButton ghost rounded icon @click="onOpenEdit">
          <BIMDataIcon name="edit" size="xxs" fill color="granite-light" />
        </BIMDataButton>
        <BIMDataButton ghost rounded icon @click="onOpenDelete">
          <BIMDataIcon name="delete" size="xxs" fill color="granite-light" />
        </BIMDataButton>
        <BIMDataButton ghost rounded icon @click="toggleMenu">
          <BIMDataIcon name="close" size="xxs" fill color="granite-light" />
        </BIMDataButton>
      </template>
      <template v-if="isEditing">
        <BIMDataButton ghost rounded icon @click="onUndoEdit">
          <BIMDataIcon name="undo" size="xxs" fill color="granite-light" />
        </BIMDataButton>
        <BIMDataButton ghost rounded icon @click="onConfirmEdit">
          <BIMDataIcon name="validate" size="xxs" fill color="granite-light" />
        </BIMDataButton>
      </template>
    </div>
    <div v-if="isDeleting" class="visa-comment-post-actions__delete">
      <span> {{ $t("Visa.comments.actions.confirmDelete") }}</span>
      <BIMDataButton fill radius color="high" @click="onConfirmDelete">
        {{ $t("Visa.comments.actions.delete") }}
      </BIMDataButton>
      <BIMDataButton ghost rounded icon @click="isDeleting = false">
        <BIMDataIcon name="close" size="xxs" fill color="primary" />
      </BIMDataButton>
    </div>
    <BIMDataButton
      v-if="!showMenu && !isEditing && !isDeleting"
      class="visa-comment-post-actions__btn"
      rounded
      icon
      @click="toggleMenu"
    >
      <BIMDataIcon name="ellipsis" size="l" />
    </BIMDataButton>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useToggle } from "../../../../../../../composables/toggle.js";

export default {
  components: {},
  props: {
    areActionsClosed: {
      type: Boolean,
      required: true
    }
  },
  emits: [
    "init-edit",
    "undo-edit",
    "confirm-edit",
    "confirm-delete",
    "toggle-close"
  ],
  setup(props, { emit }) {
    const {
      isOpen: showMenu,
      close: closeMenu,
      toggle: toggleMenu
    } = useToggle();

    const isEditing = ref(false);
    const isDeleting = ref(false);

    const onOpenEdit = () => {
      emit("init-edit");
      isEditing.value = true;
      closeMenu();
    };

    const onUndoEdit = () => {
      emit("undo-edit");
      isEditing.value = false;
    };

    const onConfirmEdit = () => {
      emit("confirm-edit");
      isEditing.value = false;
    };

    const onOpenDelete = () => {
      isDeleting.value = true;
      closeMenu();
    };

    const onConfirmDelete = () => {
      emit("confirm-delete");
      isDeleting.value = false;
    };

    const onClose = () => {
      emit("undo-edit");
      isEditing.value = false;
      isDeleting.value = false;
      closeMenu();
      emit("toggle-close");
    };

    watch(
      () => props.areActionsClosed,
      () => props.areActionsClosed && onClose()
    );

    return {
      // references
      showMenu,
      isEditing,
      isDeleting,
      // Methods
      closeMenu,
      toggleMenu,
      onOpenEdit,
      onOpenDelete,
      onUndoEdit,
      onConfirmEdit,
      onConfirmDelete,
      onClose
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaCommentPostActions.scss"></style>
