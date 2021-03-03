<template>
  <div class="project-board-view">
    <div class="sub-header">
      <div class="sub-header--left">
        <Breadcrumb />
      </div>
      <div class="sub-header--center">
        <BIMDataTabs
          width="200px"
          height="36px"
          tabSize="50%"
          selected="project"
          :tabs="[
            { id: 'project', label: 'Project' },
            { id: 'bcf', label: 'BCF' }
          ]"
        />
      </div>
      <div class="sub-header--right">
        <BIMDataButton color="primary" fill radius>
          <BIMDataIcon name="plus" size="xxxs" />
          <span>Ajouter un IFC</span>
        </BIMDataButton>
      </div>
    </div>

    <div class="container">
      <div class="block block--models">
        <div class="block__title">Modèles du projet</div>
        <div class="block__content">
          <img src="/static/empty-project-illustration-ifcs.svg" />
          <div>Téléverser votre premier IFC</div>
          <BIMDataButton color="primary" fill radius>
            Téléversement
          </BIMDataButton>
        </div>
      </div>
      <div class="block block--users">
        <div class="block__title">Utilisateurs</div>
        <div class="block__content">
          <img src="/static/empty-project-illustration-users.svg" />
          <div>Inviter votre premier collaborateur</div>
          <BIMDataButton color="primary" fill radius>
            Invitation
          </BIMDataButton>
        </div>
      </div>
      <div class="block block--files">
        <div class="block__title">Documents du projet</div>
        <div class="block__content">
          <img src="/static/empty-project-illustration-files.svg" />
          <div>Téléverser votre premier fichier</div>
          <div class="block__content__actions">
            <BIMDataButton color="primary" fill radius>
              Téléversement
            </BIMDataButton>
            <BIMDataButton color="primary" fill radius>
              Créer un dossier
            </BIMDataButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataTabs from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataTabs.js";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataTabs,
    Breadcrumb
  },
  setup() {
    // TODO
  }
};
</script>

<style scoped lang="scss" src="./ProjectBoard.scss"></style>
