<template>
  <div class="visa-main">
    <template v-if="currentView === 'visaList'">
      <VisaList
        :userVisas="userVisas"
        :startTab="currentTab"
        @set-is-visa-list="$emit('set-is-visa-list', $event)"
        @close="$emit('close', $event)"
        @reach-visa="reachVisa"
      />
    </template>
    <template v-if="currentView === 'visaAdd'">
      <VisaAdd
        :project="project"
        :file="file"
        @created-visa="createdVisa"
        @close="$emit('close', $event)"
      />
    </template>
    <template v-if="currentView === 'visaSummary'">
      <VisaSummary
        :project="project"
        :visa="currentVisa"
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
import { ref } from "vue";

import { useVisa } from "@/state/visa";
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
  setup(props, { emit }) {
    const { fetchVisa } = useVisa();

    const currentView = ref(props.isVisaList ? "visaList" : "visaAdd");
    const currentTab = ref("toValidateVisas");
    const currentVisa = ref(null);
    const baseInfo = ref({
      cloudPk: props.project.cloud.id,
      projectPk: props.project.id,
      documentPk: props.file.id
    });

    const setBaseInfo = (prop, event) => (baseInfo.value[prop] = event);
    const handleStartTab = tab => (currentTab.value = tab);

    // watch(
    //   [visa, baseInfo],
    //   () => {
    //     if (props.file.id) {
    //       currentView.value = "visaAdd";
    //     }
    //   },
    //   { immediate: true }
    // );

    const createdVisa = async visa => {
      currentVisa.value = await fetchVisa(props.project, visa);
      currentView.value = "visaSummary";
      emit("fetch-visas");
    };

    const reachVisa = (visa, tab) => {
      currentVisa.value = visa;
      currentTab.value = tab;
      currentView.value = "visaSummary";
    };

    return {
      //references
      currentVisa,
      baseInfo,
      currentView,
      currentTab,
      // methods
      setBaseInfo,
      handleStartTab,
      createdVisa,
      reachVisa
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaMain.scss"></style>
