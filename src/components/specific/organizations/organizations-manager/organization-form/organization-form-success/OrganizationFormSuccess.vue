<template>
  <div class="organization-form-success">
    <img
      class="organization-form-success__image"
      src="/static/organization-form-success.svg"
    />
    <div class="organization-form-success__title">
      {{ $t("OrganizationForm.successTitle") }}
    </div>
    <div class="organization-form-success__message">
      {{ $t("OrganizationForm.successMessage") }}
    </div>
    <BIMDataButton
      width="120px"
      color="primary"
      fill
      radius
      @click="$emit('close')"
    >
      {{ $t("OrganizationForm.successButtonText") }}
    </BIMDataButton>
  </div>
</template>

<script>
export default {
  emits: ["close"]
};
</script>

<style scoped lang="scss" src="./OrganizationFormSuccess.scss"></style>
