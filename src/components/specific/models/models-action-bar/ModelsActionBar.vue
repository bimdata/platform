<template>
  <div class="models-action-bar">
    <BIMDataButton color="high" ghost squared>
      <BIMDataIcon name="delete" size="xs" />
      <span>{{ $t("ModelsActionBar.delete") }}</span>
    </BIMDataButton>
    <BIMDataButton ghost squared>
      <BIMDataIcon name="import" size="xs" />
      <span>{{ $t("ModelsActionBar.archive") }}</span>
    </BIMDataButton>
    <BIMDataButton ghost squared>
      <BIMDataIcon name="cloud" size="xs" />
      <span>{{ $t("ModelsActionBar.download") }}</span>
    </BIMDataButton>
    <BIMDataButton ghost squared>
      <BIMDataIcon name="union" size="xs" />
      <span>{{ $t("ModelsActionBar.merge") }}</span>
    </BIMDataButton>
  </div>
</template>

<script>
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    models: {
      type: Array,
      require: true
    }
  },
  setup(props) {
    // TODO
  }
};
</script>

<style scoped lang="scss" src="./ModelsActionBar.scss"></style>
