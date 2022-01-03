<template>
  <span
    class="invoice-status-cell"
    :class="`invoice-status-cell--${statusName}`"
  >
    {{ $t(`InvoiceStatusCell.${statusName}`) }}
  </span>
</template>

<script>
import { ref, watch } from "vue";

export default {
  props: {
    invoice: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const statusName = ref("");

    watch(
      () => props.invoice,
      () => {
        switch (props.invoice.is_paid) {
          case 0:
            statusName.value = "pending";
            break;
          case 1:
            statusName.value = "completed";
            break;
        }
      },
      { immediate: true }
    );

    return {
      // References
      statusName
    };
  }
};
</script>

<style scoped lang="scss" src="./InvoiceStatusCell.scss"></style>
