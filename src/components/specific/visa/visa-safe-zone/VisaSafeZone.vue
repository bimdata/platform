<template>
  <div class="visa-safe-zone">
    <div class="visa-safe-zone__content">
      <BIMDataIconWarning size="l" class="fill-high" />
      <span>{{ $t(`Visa.safeZone.${actionType}.text`) }}</span>
    </div>
    <div class="visa-safe-zone__action">
      <BIMDataButton
        data-test-id="btn-confirm-visa-safe-zone"
        color="high"
        fill
        radius
        width="40%"
        @click="$emit('close', true)"
      >
        {{ $t("t.confirm") }}
      </BIMDataButton>
      <BIMDataButton width="40%" outline radius @click="$emit('close', false)">
        {{ $t("t.cancel") }}
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    actionType: {
      type: String,
      required: true
    }
  },
  emits: ["close"]
};
</script>

<style scoped lang="scss" src="./VisaSafeZone.scss"></style>
