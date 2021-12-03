<template>
  <div class="visa-main">
    <VisaAdd @close="$emit('close', $event)" :fileToManage="fileToManage" />
  </div>
</template>

<script>
import VisaAdd from "@/components/specific/visa/visa-add/VisaAdd";

export default {
  components: {
    VisaAdd
  },
  props: {
    fileToManage: {
      type: Object,
      required: false
    }
  },
  emits: ["close"],
  setup() {}
};
</script>

<style scoped lang="scss" src="./VisaMain.scss"></style>
