<template>
  <div class="free-plan-redirect">
    <div class="free-plan-redirect__title">
      {{ $t("FreePlanRedirect.title") }}
    </div>
    <FreePlanRedirectImage />
    <div class="free-plan-redirect__text">
      {{ $t("FreePlanRedirect.text") }}
    </div>
    <BIMDataButton width="240px" color="primary" fill radius>
      {{ $t("FreePlanRedirect.buttonText") }}
    </BIMDataButton>
  </div>
</template>

<style scoped lang="scss" src="./FreePlanRedirect.scss"></style>
