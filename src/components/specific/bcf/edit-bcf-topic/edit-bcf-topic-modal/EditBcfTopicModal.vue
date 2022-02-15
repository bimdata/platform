<template>
  <div class="overlay flex items-center justify-center">
    <div class="edit-modal flex items-center justify-center p-y-18 p-x-12">
      <BIMDataIcon name="warning" fill color="high" size="xs" />
      <span class="text-center m-y-12">
        {{ $t("EditBcfTopicModal.modalText", { name: bcfTopic.title }) }}
      </span>
      <div class="edit-modal__btns flex justify-center items-center">
        <BIMDataButton
          color="high"
          fill
          radius
          @click="$emit('close')"
          class="m-r-12"
        >
          {{ $t("EditBcfTopicModal.cancelButton") }}
        </BIMDataButton>
        <BIMDataButton
          color="primary"
          outline
          radius
          @click="$emit('continue')"
        >
          {{ $t("EditBcfTopicModal.continueButton") }}
        </BIMDataButton>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    bcfTopic: {
      type: Object
    }
  },
  emits: ["close", "continue"]
};
</script>

<style scoped lang="scss" src="./EditBcfTopicModal.scss"></style>
