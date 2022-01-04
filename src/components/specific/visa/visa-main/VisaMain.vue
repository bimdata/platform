<template>
  <div class="visa-main">
    <template v-if="currentView === 'visaList'">
      <VisaList
        :userVisas="userVisas"
        :baseInfo="baseInfo"
        @set-is-visa-list="$emit('set-is-visa-list', $event)"
        @close="$emit('close', $event)"
        @set-visa-id="setVisaId"
        @set-base-info="setBaseInfo"
      />
    </template>
    <template v-if="currentView === 'visaAdd'">
      <VisaAdd
        :baseInfo="baseInfo"
        :fileParentId="file.parentId"
        @close="$emit('close', $event)"
        @set-file-to-manage="$emit('set-file-to-manage', $event)"
        @set-visa-id="setVisaId"
        @fetch-visas="$emit('fetch-visas')"
      />
    </template>
    <template v-if="currentView === 'visaSummary'">
      <VisaSummary
        :baseInfo="baseInfo"
        :visaId="visaId"
        :isVisaList="isVisaList"
        @close="$emit('close', $event)"
        @set-visa-id="setVisaId"
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
    },
    cloudPk: {
      type: Number,
      required: true
    },
    projectPk: {
      type: Number,
      required: true
    }
  },
  emits: ["close", "set-file-to-manage", "set-is-visa-list", "fetch-visas"],
  setup(props) {
    const currentView = ref(null);
    const visaId = ref(0);
    const baseInfo = ref({
      cloudPk: props.cloudPk,
      projectPk: props.projectPk,
      documentPk: props.file.id
    });
    const setBaseInfo = (prop, event) => (baseInfo.value[prop] = event);
    const setVisaId = event => (visaId.value = event);

    watch(
      [visaId, baseInfo],
      () => {
        if (baseInfo.value.documentPk && visaId.value) {
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
      visaId,
      baseInfo,
      currentView,
      // methods
      setVisaId,
      setBaseInfo
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaMain.scss"></style>
