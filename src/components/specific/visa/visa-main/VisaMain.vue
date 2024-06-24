<template>
  <div class="visa-main">
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
        @close-visa="$emit('close')"
        @reach-file="$emit('reach-file', $event)"
      />
    </template>
  </div>
</template>

<script>
import { ref } from "vue";
import { useVisa } from "../../../../state/visa.js";

// Components
import VisaAdd from "../visa-add/VisaAdd.vue";
import VisaSummary from "../visa-summary/VisaSummary.vue";

export default {
  components: {
    VisaAdd,
    VisaList,
    VisaSummary
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
    visa: {
      type: Object,
      required: false
    },
  },
  emits: ["fetch-visas", "close", "reach-file"],
  setup(props, { emit }) {
    const { fetchVisa } = useVisa();

    const currentVisa = ref(props.visa);

    const currentView = ref(currentVisa.value.document ? "visaSummary" : "visaAdd");

    const createVisa = async visa => {
      currentVisa.value = await fetchVisa(props.project, visa);
      currentView.value = "visaSummary";
    };

    const reachVisa = visa => {
      currentVisa.value = visa;
      currentView.value = "visaSummary";
    };

    const closeVisa = () => {
      emit("fetch-visas");
      currentVisa.value = null;
    };

    return {
      //references
      currentVisa,
      currentView,
      // methods
      createVisa,
      reachVisa,
      closeVisa
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaMain.scss"></style>
