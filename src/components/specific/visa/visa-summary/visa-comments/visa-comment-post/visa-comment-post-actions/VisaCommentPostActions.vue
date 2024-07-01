<template>
  <div class="visa-comment-post-actions">
    <div style="display: flex">
      <template v-if="showMenu">
        <BIMDataButton
          data-test-id="btn-edit-visa-comment"
          ghost
          rounded
          icon
          @click="onOpenEdit"
        >
          <BIMDataIconEdit size="xxs" fill color="granite-light" />
        </BIMDataButton>
        <BIMDataButton
          data-test-id="btn-delete-visa-comment"
          ghost
          rounded
          icon
          @click="onOpenDelete"
        >
          <BIMDataIconDelete size="xxs" fill color="granite-light" />
        </BIMDataButton>
        <BIMDataButton ghost rounded icon @click="toggleMenu">
          <BIMDataIconClose size="xxs" fill color="granite-light" />
        </BIMDataButton>
      </template>
      <template v-if="isEditing">
        <BIMDataButton
          data-test-id="btn-undo-edit-visa-comment"
          ghost
          rounded
          icon
          @click="onUndoEdit"
        >
          <BIMDataIconUndo size="xxs" fill color="granite-light" />
        </BIMDataButton>
        <BIMDataButton
          data-test-id="btn-edit-visa-comment"
          ghost
          rounded
          icon
          @click="onConfirmEdit"
        >
          <BIMDataIconValidate size="xxs" fill color="granite-light" />
        </BIMDataButton>
      </template>
    </div>
    <div v-if="isDeleting" class="visa-comment-post-actions__delete">
      <span>{{ $t("Visa.comments.confirmDelete") }}</span>
      <BIMDataButton
        data-test-id="btn-confirm-delete-visa-comment"
        color="high"
        fill
        radius
        @click="onConfirmDelete"
      >
        {{ $t("t.delete") }}
      </BIMDataButton>
      <BIMDataButton ghost rounded icon @click="isDeleting = false">
        <BIMDataIconClose size="xxs" fill color="primary" />
      </BIMDataButton>
    </div>
    <BIMDataButton
      v-if="!showMenu && !isEditing && !isDeleting"
      class="visa-comment-post-actions__btn"
      data-test-id="btn-visa-comment-action"
      rounded
      icon
      @click="toggleMenu"
    >
      <BIMDataIconEllipsis size="l" />
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
      required: true,
    },
  },
  emits: ["init-edit", "undo-edit", "confirm-edit", "confirm-delete", "toggle-close"],
  setup(props, { emit }) {
    const { isOpen: showMenu, close: closeMenu, toggle: toggleMenu } = useToggle();

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
      onClose,
    };
  },
};
</script>

<style scoped lang="scss" src="./VisaCommentPostActions.scss"></style>
