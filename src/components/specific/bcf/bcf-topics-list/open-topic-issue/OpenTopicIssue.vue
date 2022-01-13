<template>
  <div class="open-topic-issue">
    <div class="open-topic-issue__header flex items-center justify-between">
      <div
        class="open-topic-issue__header__index flex justify-center items-center p-x-6"
        :class="getPriorityClasses"
      >
        {{ bcfTopic.index }}
      </div>
      <div
        class="open-topic-issue__header__date flex justify-center items-center"
      >
        {{ $d(bcfTopic.creationDate, "short") }}
      </div>
    </div>
    <div class="open-topic-issue__img m-t-12">
      <div
        class="open-topic-issue__img__status flex p-6"
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
    </div>
    <div class="open-topic-issue__elements m-t-12">
      <BIMDataButton color="default" fill radius width="100%"
        ><BIMDataIcon name="model3d" fill color="default" size="xs" /><span
          class="m-6"
          >{{ bcfTopic.components[0].selection.length }}</span
        >
        {{
          bcfTopic.components[0].selection.length
            ? "Elements"
            : "élément concerné"
        }}</BIMDataButton
      >
    </div>
    <div class="open-topic-issue__content">content</div>
    <div class="open-topic-issue__infos">infos</div>
    <div class="open-topic-issue__comment">commentaire</div>
    <div class="open-topic-issue__footer">valider</div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  props: {
    bcfTopic: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const getPriorityClasses = ref("");
    if (props.bcfTopic.priority) {
      getPriorityClasses.value = props.bcfTopic.priority.toLowerCase();
    }

    const getStatusClasses = ref("");
    if (props.bcfTopic.topicStatus) {
      getStatusClasses.value = props.bcfTopic.topicStatus.toLowerCase();
    }
    return { getPriorityClasses, getStatusClasses };
  }
};
</script>

<style scoped lang="scss" src="./OpenTopicIssue.scss"></style>
