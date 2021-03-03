<template>
  <div class="project-files-manager">
    <img src="/static/empty-project-illustration-files.svg" />
    <div>Téléverser votre premier fichier</div>
    <div class="project-files-manager__actions">
      <BIMDataButton color="primary" fill radius>
        Téléversement
      </BIMDataButton>
      <BIMDataButton color="primary" fill radius>
        Créer un dossier
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

<style scoped lang="scss" src="./ProjectFilesManager.scss"></style>
