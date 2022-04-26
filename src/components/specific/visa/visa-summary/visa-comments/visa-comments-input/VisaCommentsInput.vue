<template>
  <div class="visa-comments-input">
    <BIMDataTextarea
      ref="textarea"
      v-model="textAreaContent"
      :placeholder="
        $t(`Visa.comments.${mainComment ? 'replyComment' : 'postComment'}`)
      "
      name="comment"
      width="100%"
      :resizable="false"
      rows="1"
      fitContent
      @keyup.ctrl.enter.stop="pushComment"
    />
    <div class="visa-comments-input__action-button">
      <BIMDataButton
        color="secondary"
        radius
        width="30%"
        @click="$emit('close-comments-input')"
        >{{ $t("Visa.comments.cancel") }}</BIMDataButton
      >
      <BIMDataButton
        color="primary"
        fill
        radius
        width="30%"
        @click="pushComment"
        >{{ $t("Visa.comments.publish") }}</BIMDataButton
      >
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  props: {
    mainComment: {
      type: Object,
      default: () => null
    }
  },
  emits: ["post-comment", "close-comments-input"],
  setup(props, { emit }) {
    const textarea = ref(null);
    const textAreaContent = ref(null);

    const pushComment = async () => {
      if (textAreaContent.value) {
        const data = {
          content: textAreaContent.value,
          replyToCommentId: props.mainComment && props.mainComment.id
        };
        emit("post-comment", data);
      }
    };

    onMounted(() => setTimeout(textarea.value.focus(), 200));

    return {
      // methods
      pushComment,
      // references
      textarea,
      textAreaContent
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaCommentsInput.scss"></style>
