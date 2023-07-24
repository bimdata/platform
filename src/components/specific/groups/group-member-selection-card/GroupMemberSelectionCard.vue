<template>
  <div class="group-member-selection-card">
    <BIMDataButton
      data-test-id="btn-open-member-selector"
      class="m-36"
      width="64px"
      height="64px"
      fill
      radius
      icon
    >
      <BIMDataIconPlus size="l" />
    </BIMDataButton>
    <div class="group-member-selection-card__text">
      {{ $t("GroupMemberSelectionCard.text") }}
    </div>
  </div>
</template>

<style scoped lang="scss" src="./GroupMemberSelectionCard.scss"></style>
