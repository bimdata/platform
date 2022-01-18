<template>
  <div class="open-topic-issue">
    <div class="open-topic-issue__header flex items-center justify-between">
      <div
        class="open-topic-issue__header__title flex justify-center items-center p-x-6"
      >
        <BIMDataTextBox maxWidth="250px" :text="bcfTopic.title" />
      </div>
      <div
        class="open-topic-issue__header__actions flex justify-center items-center"
      >
        <BIMDataButton color="default" ripple rounded icon>
          <BIMDataIcon name="edit" fill color="default" size="xxs" />
        </BIMDataButton>
        <BIMDataButton color="default" ripple rounded icon @click="removeTopic">
          <BIMDataIcon name="delete" fill color="high" size="xxs" />
        </BIMDataButton>
        <BIMDataButton
          color="default"
          ripple
          rounded
          icon
          @click="$emit('close')"
        >
          <BIMDataIcon name="close" fill color="granite-light" size="xxs" />
        </BIMDataButton>
      </div>
    </div>
    <div
      class="open-topic-issue__subheader flex items-center justify-between m-t-12"
    >
      <div
        class="open-topic-issue__subheader__index flex justify-center items-center p-x-6"
        :class="getPriorityClasses"
      >
        {{ bcfTopic.index }}
      </div>
      <div
        class="open-topic-issue__subheader__date flex justify-center items-center"
      >
        {{ $d(bcfTopic.creationDate, "short") }}
      </div>
    </div>
    <div
      class="open-topic-issue__img text-center m-t-12"
      v-if="
        bcfTopic.topicStatus ||
        (bcfTopic.snapshots.length && bcfTopic.snapshots[0] !== undefined)
      "
    >
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
      <NoImgTopicBcf class="no-img-topic" v-else />
    </div>
    <div class="open-topic-issue__elements m-t-12">
      <BIMDataButton
        color="default"
        fill
        radius
        width="100%"
        :disabled="
          !bcfTopic.components.length ||
          !bcfTopic.components[0].selection.length
        "
        ><BIMDataIcon
          name="model3d"
          fill
          color="default"
          size="xs"
          margin="0 6px 0 0"
        />
        <span
          class="m-r-6"
          v-if="
            bcfTopic.components.length &&
            bcfTopic.components[0].selection.length
          "
          >{{ bcfTopic.components[0].selection.length }}</span
        >
        <span>
          {{
            bcfTopic.components.length &&
            bcfTopic.components[0].selection.length
              ? "Elements"
              : "Aucun élément concerné"
          }}</span
        ></BIMDataButton
      >
    </div>
    <div class="open-topic-issue__content m-t-12 p-12 text-left">
      <div>
        <span class="color-primary">Type:</span>
        <span class="color-granite">{{
          bcfTopic.topicType ? bcfTopic.topicType : "Pas de type spécifié"
        }}</span>
      </div>
      <div>
        <span class="color-primary">Description:</span>
        <span class="color-granite">{{
          bcfTopic.description
            ? bcfTopic.description
            : "Pas de description renseignée"
        }}</span>
      </div>
      <div>
        <span class="color-primary">Assigné à :</span>
        <span class="color-granite">{{
          bcfTopic.assignedTo ? bcfTopic.assignedTo : "Non assigné"
        }}</span>
      </div>
      <div>
        <span class="color-primary">Échéance:</span>
        <span class="color-granite">{{
          bcfTopic.dueDate
            ? $d(bcfTopic.dueDate, "short")
            : "Pas de date d'échéance"
        }}</span>
      </div>
    </div>
    <div class="open-topic-issue__infos m-t-12 p-12 text-left">
      <div class="flex items-center m-b-12">
        <BIMDataIcon name="bcf" fill color="default" />
        <span class="m-l-6">Informations</span>
      </div>
      <div>
        <span class="color-primary">Statut:</span>
        <span class="color-granite">{{
          bcfTopic.topicStatus ? bcfTopic.topicStatus : "Pas de statut spécifié"
        }}</span>
      </div>
      <div>
        <span class="color-primary">Phase :</span>
        <span class="color-granite">{{
          bcfTopic.stage ? bcfTopic.stage : "Pas de phase renseignée"
        }}</span>
      </div>
      <div>
        <span class="color-primary">Priorité:</span>
        <span class="color-granite">{{
          bcfTopic.priority ? bcfTopic.priority : "Non défini"
        }}</span>
      </div>
      <div class="m-t-12">
        <span class="color-primary">Tags:</span>
        <span class="color-granite">{{
          bcfTopic.labels.length ? bcfTopic.labels.join(", ") : "Pas de tags"
        }}</span>
      </div>
    </div>
    <div class="open-topic-issue__comment m-t-12">
      <BIMDataButton width="100%" color="primary" fill radius
        >Poster un commentaire</BIMDataButton
      >
    </div>
  </div>
</template>

<script>
import { inject, ref } from "vue";

import NoImgTopicBcf from "../../../../images/NoImgTopicBcf.vue";

import { useBcf } from "@/state/bcf.js";
import { useProjects } from "@/state/projects.js";

export default {
  components: {
    NoImgTopicBcf
  },
  props: {
    bcfTopic: {
      type: Object,
      required: true
    }
  },
  emits: ["close"],
  setup(props) {
    const getPriorityClasses = ref("");
    if (props.bcfTopic.priority) {
      getPriorityClasses.value = props.bcfTopic.priority.toLowerCase();
    }

    const getStatusClasses = ref("");
    if (props.bcfTopic.topicStatus) {
      getStatusClasses.value = props.bcfTopic.topicStatus.toLowerCase();
    }

    const { currentProject } = useProjects();
    const { deleteTopic, loadBcfTopics } = useBcf();
    const bcfTopics = inject("bcfTopics");

    const removeTopic = async () => {
      await deleteTopic(currentProject.value, props.bcfTopic);
      bcfTopics.value = await loadBcfTopics(currentProject.value);
    };

    return { getPriorityClasses, getStatusClasses, removeTopic };
  }
};
</script>

<style scoped lang="scss" src="./OpenTopicIssue.scss"></style>
