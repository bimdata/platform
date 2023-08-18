<template>
  <div class="visa-comments-input">
    <BIMDataTextarea
      ref="textarea"
      v-model="textAreaContent"
      :placeholder="$t('Visa.comments.commentInputPlaceholder')"
      name="comment"
      width="100%"
      :resizable="false"
      rows="1"
      fitContent
      @keyup.ctrl.enter.stop="pushComment"
    />
    <div class="visa-comments-input__action-button">
      <BIMDataButton
        width="30%"
        color="secondary"
        radius
        @click="$emit('close-comments-input')"
      >
        {{ $t("t.cancel") }}
      </BIMDataButton>
      <BIMDataButton
        data-test-id="btn-submit-visa-comment"
        width="30%"
        color="primary"
        fill
        radius
        @click="pushComment"
      >
        {{ $t("Visa.comments.publish") }}
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";

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
