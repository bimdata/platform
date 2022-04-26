<template>
  <div class="organization-form-success">
    <OrganizationFormSuccessImage />
    <div class="organization-form-success__title">
      {{ $t("OrganizationForm.successTitle") }}
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
