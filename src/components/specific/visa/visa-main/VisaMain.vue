<template>
  <div class="visa-main">
    <template v-if="currentView === 'visaList'">
      <VisaList
        :userVisas="userVisas"
        :startTab="currentTab"
        :visasLoading="visasLoading"
        @reach-visa="reachVisa"
        @close="$emit('close', $event)"
      />
    </template>
    <template v-if="currentView === 'visaAdd'">
      <VisaAdd
        :project="project"
        :document="document"
        @create-visa="createVisa"
        @close="$emit('close', $event)"
      />
    </template>
    <template v-if="currentView === 'visaSummary'">
      <VisaSummary
        :project="project"
        :visa="currentVisa"
        @close-visa="closeVisa"
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
    document: {
      type: Object,
      required: true
    },
    userVisas: {
      type: Object,
      required: true
    },
    visasLoading: {
      type: Boolean,
      required: true
    }
  },
  emits: ["fetch-visas", "close"],
  setup(props, { emit }) {
    const { fetchVisa } = useVisa();

    const currentView = ref(props.document.id ? "visaAdd" : "visaList");
    const currentTab = ref("toValidateVisas");
    const currentVisa = ref(null);

    const createVisa = async visa => {
      currentVisa.value = await fetchVisa(props.project, visa);
      currentView.value = "visaSummary";
    };

    const reachVisa = (visa, tab) => {
      currentVisa.value = visa;
      currentTab.value = tab;
      currentView.value = "visaSummary";
    };

    const closeVisa = () => {
      emit("fetch-visas");
      currentVisa.value = null;
      currentView.value = "visaList";
    };

    return {
      //references
      currentVisa,
      currentView,
      currentTab,
      // methods
      createVisa,
      reachVisa,
      closeVisa
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaMain.scss"></style>
