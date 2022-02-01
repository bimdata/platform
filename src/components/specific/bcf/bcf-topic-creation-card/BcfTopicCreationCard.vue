<template>
  <BIMDataCard class="create-bcf-topic flex items-center justify-center">
    <template #content>
      <EmptyBcfTopic />
      <p class="color-primary m-y-24">Créer un nouveau topic BCF</p>
      <BIMDataButton
        width="40px"
        height="40px"
        color="default"
        fill
        radius
        icon
        @click="openCreateBcfTopic"
      >
        <BIMDataIcon name="plus" fill color="default" size="m" />
      </BIMDataButton>
    </template>
  </BIMDataCard>
  <AppSidePanel title="Signaler un problème">
    <CreateBcfTopic />
  </AppSidePanel>
</template>

<script>
import { useAppSidePanel } from "@/components/specific/app/app-side-panel/app-side-panel.js";
import EmptyBcfTopic from "./EmptyBcfTopic.vue";
import AppSidePanel from "@/components/specific/app/app-side-panel/AppSidePanel.vue";
import CreateBcfTopic from "../create-bcf-topic/CreateBcfTopic.vue";
export default {
  components: {
    EmptyBcfTopic,
    AppSidePanel,
    CreateBcfTopic
  },
  setup() {
    const { openSidePanel } = useAppSidePanel();

    return {
      // Methods
      openCreateBcfTopic: openSidePanel
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfTopicCreationCard.scss"></style>
