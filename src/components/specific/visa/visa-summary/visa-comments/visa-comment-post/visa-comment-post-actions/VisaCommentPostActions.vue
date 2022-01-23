<template>
  <div class="visa-comment-post-actions">
    <div style="display: flex">
      <template v-if="showMenu">
        <BIMDataButton ghost rounded icon @click="onOpen('edit')">
          <BIMDataIcon name="edit" size="xxs" fill color="granite-light" />
        </BIMDataButton>
        <BIMDataButton ghost rounded icon @click="onOpen('delete')">
          <BIMDataIcon name="delete" size="xxs" fill color="granite-light" />
        </BIMDataButton>
        <BIMDataButton ghost rounded icon @click="toggleMenu">
          <BIMDataIcon name="close" size="xxs" fill color="granite-light" />
        </BIMDataButton>
      </template>
      <template v-if="isEditing">
        <BIMDataButton ghost rounded icon @click="onAction('cancel')">
          <BIMDataIcon name="undo" size="xxs" fill color="granite-light" />
        </BIMDataButton>
        <BIMDataButton ghost rounded icon @click="onAction">
          <BIMDataIcon name="validate" size="xxs" fill color="granite-light" />
        </BIMDataButton>
      </template>
    </div>
    <div
      v-if="isDeleting"
      class="visa-comment-post-actions__delete"
      :class="`visa-comment-post-actions__delete${
        isAReply ? '__first-comment' : ''
      }`"
    >
      <span> {{ $t("Visa.comments.actions.confirmDelete") }}</span>
      <BIMDataButton fill radius color="high" @click="onAction">
        {{ $t("Visa.comments.actions.delete") }}
      </BIMDataButton>
      <BIMDataButton ghost rounded icon @click="onAction('cancel')">
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
import { useToggle } from "@/composables/toggle.js";

export default {
  components: {},
  props: {
    isAReply: {
      type: Boolean,
      required: true
    },
    isClosed: {
      type: Boolean,
      required: true
    }
  },
  emits: ["handle-edit", "handle-delete", "toggle-close"],
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
        emit("handle-edit");
        isEditing.value = true;
      } else if (actionType === "delete") {
        isDeleting.value = true;
      }
      closeMenu();
    };

    const onAction = cancel => {
      if (isEditing.value) {
        emit("handle-edit", cancel);
        isEditing.value = false;
      } else if (isDeleting.value) {
        emit("handle-delete", cancel);
        isDeleting.value = false;
      }
    };

    const onClose = () => {
      emit("handle-edit", "cancel");
      emit("handle-delete", "cancel");
      isEditing.value = false;
      isDeleting.value = false;
      closeMenu();
      emit("toggle-close");
    };

    watch(
      () => props.isClosed,
      () => props.isClosed && onClose()
    );

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

<style scoped lang="scss" src="./VisaCommentPostActions.scss"></style>
