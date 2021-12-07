<template>
  <div class="visa-safe-zone">
    <div class="visa-safe-zone__content">
      <BIMDataIcon name="warning" size="l" class="fill-high" />
      <span>{{ $t("Visa.safeZone.content") }}</span>
    </div>
    <div class="visa-safe-zone__action">
      <BIMDataButton
        color="high"
        fill
        radius
        width="40%"
        @click="$emit('onClose', true)"
        >{{ $t("Visa.safeZone.goBack") }}</BIMDataButton
      >
      <BIMDataButton
        outline
        radius
        width="40%"
        @click="$emit('onClose', false)"
        >{{ $t("Visa.safeZone.keepView") }}</BIMDataButton
      >
    </div>
  </div>
</template>

<script>
export default {
  emits: ["onClose"]
};
</script>

<style scoped lang="scss" src="./VisaSafeZone.scss"></style>
