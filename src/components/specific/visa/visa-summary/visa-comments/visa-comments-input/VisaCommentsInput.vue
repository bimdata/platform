<template>
  <div class="visa-comments-input">
    <BIMDataTextarea
      ref="textarea"
      v-model="textAreaContent"
      :placeholder="$t('Visa.comments.postComment')"
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
  emits: ["post-comment", "close-comments-input"],
  setup(props, { emit }) {
    const textarea = ref(null);
    const textAreaContent = ref(null);

    const pushComment = async () => {
      if (textAreaContent.value) {
        emit("post-comment", {
          content: textAreaContent.value
        });
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
