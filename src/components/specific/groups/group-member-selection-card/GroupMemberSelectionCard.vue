<template>
  <div class="group-member-selection-card">
    <BIMDataButton class="m-36" width="64px" height="64px" fill radius icon>
      <BIMDataIcon name="plus" size="l" />
    </BIMDataButton>
    <div class="group-member-selection-card__text">
      {{ $t("GroupMemberSelectionCard.text") }}
    </div>
  </div>
</template>

<style scoped lang="scss" src="./GroupMemberSelectionCard.scss"></style>
