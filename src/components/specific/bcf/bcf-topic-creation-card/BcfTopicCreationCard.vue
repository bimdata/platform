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
  <SidePanel title="Signaler un problème">
    <CreateBcfTopic />
  </SidePanel>
</template>

<script>
import { useSidePanel } from "@/composables/side-panel.js";
import EmptyBcfTopic from "./EmptyBcfTopic.vue";
import SidePanel from "@/components/generic/side-panel/SidePanel.vue";
import CreateBcfTopic from "../create-bcf-topic/CreateBcfTopic.vue";
export default {
  components: {
    EmptyBcfTopic,
    SidePanel,
    CreateBcfTopic
  },
  setup() {
    const { openSidePanel } = useSidePanel();

    return {
      // Methods
      openCreateBcfTopic: openSidePanel
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfTopicCreationCard.scss"></style>
