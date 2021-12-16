<template>
  <div class="organization-import-success">
    <OrganizationFormSuccessImage />
    <div class="organization-import-success__title">
      {{ $t("OrganizationSpacesImport.successTitle") }}
    </div>
    <div class="organization-import-success__message">
      {{ $t("OrganizationSpacesImport.successMessage") }}
    </div>
    <BIMDataButton
      width="120px"
      color="primary"
      fill
      radius
      @click="$emit('close')"
    >
      {{ $t("OrganizationSpacesImport.successButtonText") }}
    </BIMDataButton>
  </div>
</template>

<script>
export default {
  emits: ["close"]
};
</script>

<style scoped lang="scss" src="./OrganizationImportSuccess.scss"></style>
