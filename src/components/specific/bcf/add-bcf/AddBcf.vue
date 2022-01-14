<template>
  <app-slot-content name="project-board-action">
    <BIMDataButton
      width="140px"
      color="primary"
      fill
      radius
      @click="openCreateBcfTopic"
    >
      <BIMDataIcon name="plus" size="xxxs" margin="0 6px 0 0" />
      <span>Ajouter un BCF</span>
    </BIMDataButton>
  </app-slot-content>
  <SidePanel title="Signaler un problème">
    <CreateBcfTopic />
  </SidePanel>
</template>

<script>
import { useSidePanel } from "@/composables/side-panel.js";
// Components
import AppSlotContent from "@/components/generic/app-slot/AppSlotContent.vue";
import SidePanel from "@/components/generic/side-panel/SidePanel.vue";

import CreateBcfTopic from "../create-bcf-topic/CreateBcfTopic.vue";
export default {
  components: {
    AppSlotContent,
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
