<template>
  <div class="versioning-safe-zone">
    <div class="versioning-safe-zone__content">
      <BIMDataIconWarning size="l" class="fill-high" />
      <span>{{ $t(`Versioning.safeZone.delete.content`) }}</span>
    </div>
    <div class="versioning-safe-zone__action">
      <BIMDataButton
        data-test-id="btn-confirm-delete"
        color="high"
        fill
        radius
        width="40%"
        @click="$emit('close', true)"
        >{{ $t(`Versioning.safeZone.delete.action`) }}</BIMDataButton
      >
      <BIMDataButton
        outline
        radius
        width="40%"
        @click="$emit('close', false)"
        >{{ $t(`Versioning.safeZone.delete.keepView`) }}</BIMDataButton
      >
    </div>
  </div>
</template>

<script>
export default {
  emits: ["close"]
};
</script>

<style scoped lang="scss" src="./VersioningSafeZone.scss"></style>
