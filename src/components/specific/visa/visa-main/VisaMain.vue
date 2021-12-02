<template>
  <div class="visa-main">
    <VisaAdd @close="$emit('close', $event)" />
  </div>
</template>

<script>
import VisaAdd from "@/components/specific/visa/visa-add/VisaAdd";

export default {
  components: {
    VisaAdd
  },
  props: {},
  emits: ["close"],
  setup() {}
};
</script>

<style scoped lang="scss" src="./VisaMain.scss"></style>
