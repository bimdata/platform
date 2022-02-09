<template>
  <EditBcfTopic
    v-if="isOpenEditTopic"
    :bcfTopic="bcfTopic"
    @close="isOpenEditTopic = false"
  />
  <div v-else class="open-topic-issue">
    <div class="open-topic-issue__header flex items-center justify-between">
      <div
        class="open-topic-issue__header__title flex justify-center items-center p-x-6"
      >
        <BIMDataTextBox maxWidth="250px" :text="bcfTopic.title" />
      </div>
      <div
        class="open-topic-issue__header__actions flex justify-center items-center"
      >
        <BIMDataButton
          color="default"
          ripple
          rounded
          icon
          @click="isOpenEditTopic = !isOpenEditTopic"
        >
          <BIMDataIcon name="edit" fill color="default" size="xxs" />
        </BIMDataButton>
        <BIMDataButton
          color="default"
          ripple
          rounded
          icon
          @click="deleteTopicModal = true"
        >
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
    <div class="open-topic-issue__content p-r-6 p-b-6 p-l-6">
      <div
        class="open-topic-issue__content__subheader flex items-center justify-between m-t-12"
      >
        <div
          class="open-topic-issue__content__subheader__index flex justify-center items-center p-x-6"
          :class="getPriorityClasses"
        >
          {{ bcfTopic.index }}
        </div>
        <div
          class="open-topic-issue__content__subheader__date flex justify-center items-center"
        >
          {{ $d(bcfTopic.creationDate, "short") }}
        </div>
      </div>
      <div class="open-topic-issue__content__img text-center m-t-12">
        <div
          class="open-topic-issue__content__img__status flex p-6"
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
      <div class="open-topic-issue__content__card m-t-12 p-12 text-left">
        <div class="flex items-center m-b-12">
          <BIMDataIcon
            name="model3d"
            fill
            color="default"
            size="xs"
            margin="0 6px 0 0"
          />
          <span class="m-r-6" v-if="topicElements.length > 0">
            {{ topicElements.length }}
          </span>
          <span>
            {{ topicElements.length ? "Elements" : "0 Element" }}
          </span>
        </div>
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
      <div class="open-topic-issue__content__card m-t-12 p-12 text-left">
        <div class="flex items-center m-b-12">
          <BIMDataIcon name="bcf" fill color="default" />
          <span class="m-l-6">Informations</span>
        </div>
        <div>
          <span class="color-primary">Statut:</span>
          <span class="color-granite">{{
            bcfTopic.topicStatus || "Pas de statut spécifié"
          }}</span>
        </div>
        <div>
          <span class="color-primary">Phase :</span>
          <span class="color-granite">{{
            bcfTopic.stage || "Pas de phase renseignée"
          }}</span>
        </div>
        <div>
          <span class="color-primary">Priorité:</span>
          <span class="color-granite">{{
            bcfTopic.priority || "Non défini"
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
    <div
      v-if="deleteTopicModal"
      class="overlay flex items-center justify-center"
    >
      <div class="delete-modal flex items-center justify-center p-y-18">
        <BIMDataIcon name="warning" fill color="high" size="xs" />
        <span class="m-y-12"
          >Vous êtes sur le point de supprimer
          <strong>{{ bcfTopic.title }}</strong></span
        >
        <div class="delete-modal__btns flex justify-center items-center">
          <BIMDataButton
            color="high"
            fill
            radius
            @click="removeTopic"
            class="m-r-18"
          >
            Supprimer ce BCF
          </BIMDataButton>
          <BIMDataButton
            color="primary"
            outline
            radius
            @click="deleteTopicModal = false"
          >
            Conserver ce BCF
          </BIMDataButton>
        </div>
      </div>
    </div>
    <div v-if="loading" class="overlay flex items-center justify-center">
      <BIMDataSpinner />
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";

import NoImgTopicBcf from "../../../../images/NoImgTopicBcf.vue";
import EditBcfTopic from "@/components/specific/bcf/edit-bcf-topic/EditBcfTopic.vue";

import { useBcf } from "@/state/bcf.js";
import { useProjects } from "@/state/projects.js";

export default {
  components: {
    EditBcfTopic,
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
    const { deleteTopic } = useBcf();
    const loading = ref(false);
    const deleteTopicModal = ref(false);

    const removeTopic = async () => {
      try {
        loading.value = true;
        await deleteTopic(currentProject.value, props.bcfTopic);
      } finally {
        loading.value = false;
      }
    };

    const isOpenEditTopic = ref(false);

    const topicElements = computed(() => {
      if (
        props.bcfTopic.components &&
        props.bcfTopic.components.length > 0 &&
        props.bcfTopic.components[0].selection
      ) {
        return props.bcfTopic.components[0].selection;
      } else {
        return [];
      }
    });

    return {
      loading,
      deleteTopicModal,
      isOpenEditTopic,
      getPriorityClasses,
      getStatusClasses,
      removeTopic,
      topicElements
    };
  }
};
</script>

<style scoped lang="scss" src="./OpenTopicIssue.scss"></style>
