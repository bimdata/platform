<template>
  <div class="bcf-topic">
    <div class="bcf-topic__header">
      <div class="bcf-topic__header__infos flex">
        <div
          class="bcf-topic__header__infos__index flex items-center justify-center"
          :class="getPriorityClasses"
        >
          {{ bcfTopic.index }}
        </div>
        <div class="bcf-topic__header__infos__title flex items-center m-l-12">
          <BIMDataTextBox maxWidth="100% - 48px)" :text="bcfTopic.title" />
        </div>
      </div>
      <div class="bcf-topic__header__img flex items-center justify-center">
        <div
          class="bcf-topic__header__img__status flex p-6"
          :class="getStatusClasses"
          v-if="bcfTopic.topicStatus"
        >
          <BIMDataIcon name="information" fill color="default" />
          <span class="m-l-6">{{ bcfTopic.topicStatus }}</span>
        </div>
        <img
          v-if="
            bcfTopic.snapshots &&
            bcfTopic.snapshots.length > 0 &&
            bcfTopic.snapshots[0] !== undefined
          "
          :src="bcfTopic.snapshots[0].snapshotData"
          alt=""
        />
        <BIMDataIcon v-else name="default" size="xxxl" fill color="default" />
      </div>
    </div>
    <div class="bcf-topic__content p-12">
      <div class="bcf-topic__content__priority">
        <strong>Priorité : </strong>
        <span v-if="bcfTopic.priority" :class="getPriorityClasses">{{
          bcfTopic.priority
        }}</span>
        <span v-else>Non renseigné</span>
      </div>
      <div>
        <strong>Assigné à : </strong>
        <span v-if="bcfTopic.assignedTo">{{ bcfTopic.assignedTo }}</span>
        <span v-else>Non renseigné</span>
      </div>
      <div class="flex justify-around m-t-12">
        <BIMDataButton color="default" fill radius width="48%"
          ><BIMDataIcon name="model3d" fill color="default" size="xs" /><span
            class="m-6"
            >{{ bcfTopic.components[0].selection.length }}</span
          >
          {{
            bcfTopic.components[0].selection.length ? "Elements" : "Element"
          }}</BIMDataButton
        >
        <BIMDataButton color="primary" fill radius width="48%"
          >Ouvrir</BIMDataButton
        >
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  props: {
    project: {
      type: Object,
      required: true
    },
    bcfTopic: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const getPriorityClasses = ref("");
    const getStatusClasses = ref("");
    if (props.bcfTopic.priority) {
      getPriorityClasses.value = props.bcfTopic.priority.toLowerCase();
    }
    if (props.bcfTopic.topicStatus) {
      getStatusClasses.value = props.bcfTopic.topicStatus.toLowerCase();
    }
    return { getPriorityClasses, getStatusClasses };
  }
};
</script>

<style scoped lang="scss" src="./BcfTopics.scss"></style>
