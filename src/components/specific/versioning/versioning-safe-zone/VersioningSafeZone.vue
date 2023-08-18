<template>
  <div class="versioning-safe-zone">
    <div class="versioning-safe-zone__content">
      <BIMDataIconWarning size="l" class="fill-high" />
      <span>{{ $t(`Versioning.safeZone.delete.content`) }}</span>
    </div>
    <div class="versioning-safe-zone__action">
      <BIMDataButton
        data-test-id="btn-confirm-delete"
        width="40%"
        color="high"
        fill
        radius
        @click="$emit('close', true)"
      >
        {{ $t(`Versioning.safeZone.delete.action`) }}
      </BIMDataButton>
      <BIMDataButton width="40%" outline radius @click="$emit('close', false)">
        {{ $t("t.cancel") }}
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["close"]
};
</script>

<style scoped lang="scss" src="./VersioningSafeZone.scss"></style>
