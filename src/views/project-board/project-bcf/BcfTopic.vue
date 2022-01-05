<template>
  <div
    v-for="bcfTopic in bcfTopics"
    :key="bcfTopic.index"
    class="bcf-topic m-l-48"
  >
    <div class="bcf-topic__header">
      <div class="bcf-topic__header__infos flex">
        <div
          class="bcf-topic__header__infos__index flex items-center justify-center"
        >
          {{ bcfTopic.index }}
        </div>
        <div class="bcf-topic__header__infos__title flex items-center m-l-12">
          <span>{{ bcfTopic.title }}</span>
        </div>
      </div>
      <div class="bcf-topic__header__img">
        <div
          class="bcf-topic__header__img__status flex m-t-6 m-l-6"
          v-if="bcfTopic.topicStatus"
        >
          <BIMDataIcon name="information" fill color="default" />
          <span class="m-l-6">{{ bcfTopic.topicStatus }}</span>
        </div>
      </div>
    </div>
    <div class="bcf-topic__content p-12">
      <div>
        <strong>Priorité :</strong> <span>{{ bcfTopic.priority }}</span>
      </div>
      <div>
        <strong>Assingé à :</strong>
        <span v-if="bcfTopic.assigned_to">{{ bcfTopic.assigned_to }}</span>
        <span v-else>Non renseigné</span>
      </div>
      <div class="flex justify-around m-t-12">
        <BIMDataButton color="default" fill radius width="48%"
          >Element</BIMDataButton
        >
        <BIMDataButton color="primary" fill radius width="48%"
          >Ouvrir</BIMDataButton
        >
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";

import { useBcf } from "@/state/bcf.js";

export default {
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { loadBcfTopics } = useBcf();
    const bcfTopics = ref([]);
    watch(
      () => props.project,
      async () => {
        bcfTopics.value = await loadBcfTopics(props.project);
      },
      { immediate: true }
    );

    return {
      bcfTopics
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfTopic.scss"></style>
