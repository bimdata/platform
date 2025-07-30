<template>
  <div class="project-notifications-recipients">
    <!-- header -->
    <div class="flex items-center justify-between">
      <BIMDataButton color="primary" ghost radius icon @click="$emit('back-to-settings')">
        <BIMDataIconArrow size="xxs" />
        <span style="margin-left: 6px">{{ $t("t.back") }}</span>
      </BIMDataButton>
      <div class="flex items-center">
        <BIMDataIconKey fill color="default" margin="0 6px 0 0" size="xs" />
        <span>{{ $t("ProjectOverview.notifications.recipients.title") }}</span>
      </div>
      <BIMDataButton ghost rounded icon @click="$emit('close')">
        <BIMDataIconClose size="xxs" fill color="granite-light" />
      </BIMDataButton>
    </div>

    <!-- info text -->
    <div class="header m-t-12">
      <p class="text-center">
        {{ $t("ProjectOverview.notifications.recipients.text") }}
      </p>
    </div>

    <!-- group list -->
    <div class="m-t-12">
      <GroupCard
        v-for="group in projectGroups"
        :key="group.id"
        :group="group"
        :model-value="selectedGroupIds.includes(group.id)"
        @update:model-value="(checked) => toggleGroupSelection(group.id, checked)"
      />
    </div>

    <!-- empty group -->
    <div v-if="projectGroups.length === 0" class="empty-group">
      <p class="text-center m-t-12">
        {{ $t("ProjectOverview.notifications.recipients.noGroupsText") }}
      </p>
      <BIMDataButton color="primary" fill radius width="100%" @click="goToProjectGroups">
        {{ $t("ProjectOverview.notifications.recipients.createGroupButtonText") }}
      </BIMDataButton>
    </div>

    <!-- validate button -->
    <div v-else class="footer m-t-18">
      <BIMDataButton color="primary" fill radius width="100%" @click="updateNotifications">
        {{ $t("ProjectOverview.notifications.recipients.validateButtonText") }}
      </BIMDataButton>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useGroups } from "../../../../state/groups.js";
import routeNames from "../../../../router/route-names.js";

import GroupCard from "./group-card/GroupCard.vue";

const props = defineProps({
  selectedRecipientsIds: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(["back-to-settings", "close", "update-recipients"]);

const { projectGroups } = useGroups();
const route = useRoute();
const router = useRouter();

const selectedGroupIds = ref([...props.selectedRecipientsIds]);

const toggleGroupSelection = (groupId, checked) => {
  if (checked) {
    if (!selectedGroupIds.value.includes(groupId)) {
      selectedGroupIds.value.push(groupId);
    }
  } else {
    selectedGroupIds.value = selectedGroupIds.value.filter((id) => id !== groupId);
  }
};

const updateNotifications = () => {
  emit("update-recipients", selectedGroupIds.value);
  emit("back-to-settings");
};

const goToProjectGroups = () => {
  router.push({
    name: routeNames.projectGroups,
    params: {
      spaceID: +route.params.spaceID,
      projectID: +route.params.projectID,
    },
  });
};

watch(
  () => props.selectedRecipientsIds,
  (newVal) => {
    selectedGroupIds.value = [...newVal];
  },
  { immediate: true }
);
</script>

<style scoped src="./ProjectNotificationsRecipients.css"></style>
