<template>
  <div class="project-models-manager">
    <img src="/static/empty-project-illustration-ifcs.svg" />
    <div>Téléverser votre premier IFC</div>
    <div class="project-models-manager__actions">
      <BIMDataButton color="primary" fill radius>
        Téléversement
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";

export default {
  components: {
    BIMDataButton
  },
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  setup() {
    // TODO
  }
};
</script>

<style scoped lang="scss" src="./ProjectModelsManager.scss"></style>
