<template>
  <div class="visa-main">
    <template v-if="currentView === 'visaList'">
      <VisaList
        :userVisas="userVisas"
        :startTab="startTab"
        @set-is-visa-list="$emit('set-is-visa-list', $event)"
        @close="$emit('close', $event)"
        @set-visa="visa = $event"
        @set-base-info="setBaseInfo"
        @handle-start-tab="handleStartTab"
      />
    </template>
    <template v-if="currentView === 'visaAdd'">
      <VisaAdd
        :project="project"
        :file="file"
        @close="$emit('close', $event)"
        @set-visa="visa = $event"
        @set-base-info="setBaseInfo"
        @fetch-visas="$emit('fetch-visas')"
      />
    </template>
    <template v-if="currentView === 'visaSummary'">
      <VisaSummary
        :baseInfo="baseInfo"
        :visaId="visa.id"
        :isVisaList="isVisaList"
        @close="$emit('close', $event)"
        @set-visa="visa = $event"
        @set-is-visa-list="$emit('set-is-visa-list', $event)"
        @fetch-visas="$emit('fetch-visas')"
      />
    </template>
  </div>
</template>

<script>
import { ref, watch } from "vue";

import VisaAdd from "@/components/specific/visa/visa-add/VisaAdd";
import VisaSummary from "@/components/specific/visa/visa-summary/VisaSummary";
import VisaList from "../visa-list/VisaList";

export default {
  components: {
    VisaAdd,
    VisaSummary,
    VisaList
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    file: {
      type: Object,
      required: true
    },
    userVisas: {
      type: Object,
      required: true
    },
    isVisaList: {
      type: Boolean,
      required: true
    }
  },
  emits: ["close", "set-is-visa-list", "fetch-visas"],
  setup(props) {
    const currentView = ref(null);
    const startTab = ref("toValidateVisas");
    const visa = ref(null);
    const baseInfo = ref({
      cloudPk: props.project.cloud.id,
      projectPk: props.project.id,
      documentPk: props.file.id
    });

    const setBaseInfo = (prop, event) => (baseInfo.value[prop] = event);
    const handleStartTab = tab => (startTab.value = tab);

    watch(
      [visa, baseInfo],
      () => {
        if (baseInfo.value.documentPk && visa.value) {
          currentView.value = "visaSummary";
        } else if (props.isVisaList) {
          currentView.value = "visaList";
        } else if (props.file.id) {
          currentView.value = "visaAdd";
        }
      },
      { immediate: true }
    );

    return {
      //references
      visa,
      baseInfo,
      currentView,
      startTab,
      // methods
      setBaseInfo,
      handleStartTab
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaMain.scss"></style>
