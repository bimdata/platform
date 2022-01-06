<template>
  <div class="bcf-topic">
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
      <div class="bcf-topic__header__img flex items-center justify-center">
        <div
          class="bcf-topic__header__img__status flex p-6"
          :class="bcfTopic.topicStatus.toLowerCase()"
          v-if="bcfTopic.topicStatus"
        >
          <BIMDataIcon name="information" fill color="default" />
          <span class="m-l-6">{{ bcfTopic.topicStatus }}</span>
        </div>
        <img
          v-if="bcfTopic.snapshots && bcfTopic.snapshots.length"
          :src="bcfTopic.snapshots[0].snapshotData"
          alt=""
        />
        <BIMDataIcon v-else name="default" size="xxxl" fill color="default" />
      </div>
    </div>
    <div class="bcf-topic__content p-12">
      <div>
        <strong>Priorité : </strong>
        <span v-if="bcfTopic.priority">{{ bcfTopic.priority }}</span>
        <span v-else>Non renseigné</span>
      </div>
      <div>
        <strong>Assigné à : </strong>
        <span v-if="bcfTopic.assignedTo">{{ bcfTopic.assignedTo }}</span>
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
  }
};
</script>

<style scoped lang="scss" src="./BcfTopics.scss"></style>
