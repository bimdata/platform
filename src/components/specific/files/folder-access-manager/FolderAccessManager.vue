<template>
  <div class="folder-access-manager">
    <div class="folder-access-manager__title">
      <BIMDataIcon name="key" size="l" />
      <span class="folder-access-manager__title__text">
        {{ $t("FolderAccessManager.title") }}
      </span>
      <BIMDataButton ghost rounded icon @click="$emit('close')">
        <BIMDataIcon name="close" size="xxs" fill color="tertiary-dark" />
      </BIMDataButton>
    </div>
    <div class="folder-access-manager__head">
      <BIMDataButton width="100%" color="primary" fill radius @click="goToProjectGroups">
        <BIMDataIcon name="group" size="s" margin="0 6 0 0" />
        <span>{{ $t("FolderAccessManager.groupsButtonText") }}</span>
      </BIMDataButton>
      <GroupAccessSelector />
    </div>
    <div class="folder-access-manager__body">
      <div class="folder-access-manager__body__head">
        <span class="folder-access-manager__body__head--name">
          {{ $t("FolderAccessManager.nameHeader") }}
        </span>
        <span class="folder-access-manager__body__head--rights">
          {{ $t("FolderAccessManager.rightsHeader") }}
        </span>
        <span class="folder-access-manager__body__head--members">
          {{ $t("FolderAccessManager.membersHeader") }}
        </span>
      </div>
      <GroupAccessSelector v-for="group of groups" :key="group.id" :group="group" />
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { routeNames } from "@/router";
// Components
import GroupAccessSelector from "./group-access-selector/GroupAccessSelector";

export default {
  components: {
    GroupAccessSelector,
  },
  props: {
    project: {
      type: Object,
      required: true,
    },
    folder: {
      type: Object,
      required: true,
    },
    groups: {
      type: Array,
      required: true,
    },
  },
  emits: ["close"],
  setup(props) {
    const router = useRouter();

    const goToProjectGroups = () => {
      router.push({
        name: routeNames.projectGroups,
        params: {
          spaceID: props.project.cloud.id,
          projectID: props.project.id,
        },
      });
    };

    return {
      // Methods
      goToProjectGroups,
    };
  },
};
</script>

<style scoped lang="scss" src="./FolderAccessManager.scss"></style>
