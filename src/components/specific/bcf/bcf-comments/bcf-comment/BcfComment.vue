<template>
  <div class="bcf-comment">
    <div class="bcf-comment__header flex items-center justify-between">
      <div class="bcf-comment__header__left flex items-center">
        <UserAvatar
          v-if="authorDetail"
          :user="authorDetail"
          size="27"
          initialsSize="14"
          color="silver-light"
          style="box-shadow: var(--box-shadow)"
          class="m-r-12"
        />
        <span
          v-else
          class="bcf-comment__header__left__user flex items-center justify-center m-r-12"
        >
          <BIMDataIcon name="user" fill color="granite" size="xxs" />
        </span>
        <strong>{{ comment.author }}</strong>
        <span class="color-granite m-x-6">•</span>
        <strong class="color-granite">{{ $d(comment.date, "long") }}</strong>
      </div>

      <div class="bcf-comment__header__right">
        <div class="bcf-comment__header__right__actions flex">
          <template v-if="showMenu">
            <BIMDataButton ghost rounded icon @click="onOpenEdit">
              <BIMDataIcon name="edit" size="xxs" fill color="granite-light" />
            </BIMDataButton>
            <BIMDataButton ghost rounded icon @click="onOpenDelete">
              <BIMDataIcon
                name="delete"
                size="xxs"
                fill
                color="granite-light"
              />
            </BIMDataButton>
            <BIMDataButton ghost rounded icon @click="toggleMenu">
              <BIMDataIcon name="close" size="xxs" fill color="granite-light" />
            </BIMDataButton>
          </template>
          <template v-if="isEditing">
            <BIMDataButton ghost rounded icon @click="isEditing = false">
              <BIMDataIcon name="undo" size="xxs" fill color="granite-light" />
            </BIMDataButton>
            <BIMDataButton ghost rounded icon @click="confirmEdit">
              <BIMDataIcon
                name="validate"
                size="xxs"
                fill
                color="granite-light"
              />
            </BIMDataButton>
          </template>
        </div>
        <div
          v-if="isDeleting"
          class="bcf-comment__header__right__delete p-x-12"
        >
          <span> Supprimer ce commentaire ?</span>
          <div class="flex items-center">
            <BIMDataButton
              fill
              radius
              color="high"
              @click="confirmDelete"
              class="m-r-6"
            >
              Supprimer
            </BIMDataButton>
            <BIMDataButton ghost rounded icon @click="isDeleting = false">
              <BIMDataIcon name="close" size="xxs" fill color="primary" />
            </BIMDataButton>
          </div>
        </div>
        <BIMDataButton
          v-if="!showMenu && !isDeleting && !isEditing"
          class="bcf-comment__header__right__btn"
          rounded
          icon
          @click="toggleMenu"
        >
          <BIMDataIcon name="ellipsis" fill size="l" color="granite-light" />
        </BIMDataButton>
      </div>
    </div>
    <div class="bcf-comment__content">
      <BIMDataTextarea
        name="comment"
        v-model="commentContent"
        :class="{ editing: isEditing }"
        autofocus
        fitContent
        width="100%"
        :readonly="!isEditing"
        :resizable="false"
        rows="1"
      />
    </div>
    <template v-if="loading">
      <BIMDataLoading />
    </template>
  </div>
</template>

<script>
import { ref } from "vue";
import { useProjects } from "@/state/projects.js";
import { useBcf } from "@/state/bcf.js";
import { useToggle } from "@/composables/toggle.js";

import UserAvatar from "@/components/specific/users/user-avatar/UserAvatar";
export default {
  components: {
    UserAvatar
  },
  props: {
    comment: {
      type: Object,
      required: true
    },
    bcfTopic: {
      type: Object,
      required: true
    }
  },
  emits: ["confirm-delete", "confirm-edit"],
  setup(props) {
    const { projectUsers, currentProject } = useProjects();
    const { deleteComment, updateComment } = useBcf();
    const {
      isOpen: showMenu,
      close: closeMenu,
      toggle: toggleMenu
    } = useToggle();

    const commentContent = ref(props.comment.comment);
    const loading = ref(false);

    const authorDetail = projectUsers.value.find(
      projectUser => projectUser.email === props.comment.author
    );

    const isDeleting = ref(false);
    const onOpenDelete = () => {
      isDeleting.value = true;
      closeMenu();
    };
    const confirmDelete = async () => {
      try {
        loading.value = true;
        await deleteComment(
          currentProject.value,
          props.bcfTopic,
          props.comment
        );
        isDeleting.value = false;
      } finally {
        loading.value = false;
      }
    };

    const isEditing = ref(false);
    const onOpenEdit = () => {
      isEditing.value = true;
      closeMenu();
    };
    const confirmEdit = async () => {
      if (props.comment.comment !== commentContent.value) {
        try {
          loading.value = true;
          await updateComment(
            currentProject.value,
            props.bcfTopic,
            props.comment,
            {
              comment: commentContent.value
            }
          );
          isEditing.value = false;
        } finally {
          loading.value = false;
        }
      }
    };

    return {
      loading,
      authorDetail,
      commentContent,
      isDeleting,
      isEditing,
      // Methods
      showMenu,
      closeMenu,
      toggleMenu,
      onOpenDelete,
      confirmDelete,
      confirmEdit,
      onOpenEdit
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfComment.scss"></style>
