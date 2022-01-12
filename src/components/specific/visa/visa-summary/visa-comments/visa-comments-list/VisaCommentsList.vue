<template>
  <!-- {{ console.log("isEditing", isEditing) }}
  {{ console.log("commentToEdit", commentToEdit) }}
  {{ console.log("commentsList", commentsList) }} -->

  <div
    class="visa-comments-list"
    v-for="comment in commentsList"
    :key="comment.id"
  >
    <div class="visa-comments-list__header">
      <div class="visa-comments-list__header__left-side">
        <UserAvatar
          :user="comment.author"
          size="27"
          sizeInitials="14"
          color="silver-light"
          style="box-shadow: var(--box-shadow)"
        />
        <BIMDataTextBox
          class="visa-comments-list__header__left-side__name"
          :text="comment.fullName || comment.author.email"
          maxWidth="30%"
        />
        <span class="visa-comments-list__header__left-side__separator">•</span>
        <span class="visa-comments-list__header__left-side__date">{{
          formatDateDDMMYYYHHMM(comment.createdAt)
        }}</span>
      </div>
      <div class="visa-comments-list__header__right-side">
        <template v-if="isEditing && commentToEdit.id === comment.id">
          <BIMDataButton ghost rounded icon @click="handleEdit(null, 'undo')">
            <BIMDataIcon
              name="undo"
              size="xxs"
              fill
              color="granite-light"
              @click="handleEdit(null, 'undo')"
            />
          </BIMDataButton>
          <BIMDataButton ghost rounded icon @click="handleEdit(comment.id)">
            <BIMDataIcon
              name="validate"
              size="xxs"
              fill
              color="granite-light"
            />
          </BIMDataButton>
        </template>
        <template v-if="!isEditing && comment.isSelf">
          <VisaCommentsListActons
            :commentId="comment.id"
            @handle-edit="handleEdit"
            @handle-delete="handleDelete"
          />
        </template>
      </div>
    </div>
    <div class="visa-comments-list__content">
      <BIMDataTextarea
        v-model="comment.content"
        :class="{ editing: isEditing }"
        name="description"
        width="100%"
        :readonly="!isEditing"
        :resizable="false"
        rows="1"
        fitContent
      />
    </div>
    <template v-if="!isEditing">
      <BIMDataButton
        color="secondary"
        radius
        width="30%"
        style="margin: -6% 0 0 74%; font-size: 1.15em"
        >{{ $t("Visa.comments.reply") }}</BIMDataButton
      >
    </template>
  </div>
</template>

<script>
import { ref } from "vue";
import UserAvatar from "@/components/specific/users/user-avatar/UserAvatar";
import VisaCommentsListActons from "./visa-comments-list-actions/VisaCommentsListActions.vue";
import { formatDateDDMMYYYHHMM } from "@/utils/date";
import { useVisa } from "@/state/visa";

export default {
  components: { UserAvatar, VisaCommentsListActons },
  props: {
    commentsList: {
      type: Array,
      required: true
    },
    visaId: {
      type: Number,
      required: true
    },
    baseInfo: {
      type: Object,
      required: true
    }
  },
  emits: ["get-comments"],
  setup(props, { emit }) {
    const { updateComment, deleteComment } = useVisa();

    const isEditing = ref(false);
    const commentToEdit = ref(null);
    const copyOfContent = ref(null);

    const handleEdit = async (commentId, undo) => {
      if (undo === "undo") {
        commentToEdit.value.content = copyOfContent.value;
        isEditing.value = false;
      } else if (isEditing.value) {
        await updateComment(commentId, props.visaId, props.baseInfo, {
          content: commentToEdit.value.content
        });
        isEditing.value = false;
        commentToEdit.value = null;
      } else if (!isEditing.value) {
        commentToEdit.value = props.commentsList.find(
          ({ id }) => id === commentId
        );
        copyOfContent.value = commentToEdit.value.content;
        isEditing.value = true;
      }
    };

    const handleDelete = async commentId => {
      await deleteComment(commentId, props.visaId, props.baseInfo);
      await emit("get-comments");
    };

    return {
      //references
      isEditing,
      commentToEdit,
      // methods
      formatDateDDMMYYYHHMM,
      handleEdit,
      handleDelete,
      console
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaCommentsList.scss"></style>
