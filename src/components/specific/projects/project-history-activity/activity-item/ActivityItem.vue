<template>
  <div class="activity-item" @click="toggle">
    <div class="icon" :class="log.activity.class">
      <BIMDataIcon :name="log.activity.icon" size="xxs" />
    </div>

    <div class="content">
      <div class="title">
        <span class="title-label">
          {{ $t(log.activity.actionKey, log.activity.params) }}
        </span>

        <BIMDataTextbox
          v-if="log.activity.target"
          class="primary target-text"
          :text="log.activity.target"
        />
      </div>

      <div class="date">
        {{ formatTimeAgo(log.dateObj) }}
        - {{ $d(log.dateObj, "long") }}
      </div>

      <transition name="expand">
        <div v-if="isOpen" class="details">
          <div v-if="log.activity.details.path" class="detail detail-path flex items-center">
            <span>{{ $t("ProjectOverview.activity.folderTitle") }}</span>
            <strong
              @click.stop="
                $emit('go-folder', {
                  id: log.activity.details.folderId,
                  path: log.activity.details.path,
                })
              "
              >{{ log.activity.details.path }}</strong
            >
            <BIMDataIconFolderLocation fill color="primary" />
          </div>

          <div v-if="log.activity.details.roleKey" class="detail">
            {{ $t("ProjectOverview.activity.roleTitle") }}
            <strong>
              {{ $t(`ProjectOverview.activity.roles.${log.activity.details.roleKey}`) }}
            </strong>
          </div>

          <div v-if="log.activity.details.oldPermissionKey" class="detail">
            {{ $t("ProjectOverview.activity.oldPermissionTitle") }}
            <strong>
              {{
                $t(`ProjectOverview.activity.permissions.${log.activity.details.oldPermissionKey}`)
              }}
            </strong>
          </div>

          <div v-if="log.activity.details.newPermissionKey" class="detail">
            {{ $t("ProjectOverview.activity.newPermissionTitle") }}
            <strong>
              {{
                $t(`ProjectOverview.activity.permissions.${log.activity.details.newPermissionKey}`)
              }}
            </strong>
          </div>

          <div v-if="log.activity.details.oldName" class="detail">
            {{ $t("ProjectOverview.activity.oldNameTitle") }}
            <strong>{{ log.activity.details.oldName }}</strong>
          </div>

          <div v-if="log.activity.details.newName" class="detail">
            {{ $t("ProjectOverview.activity.newNameTitle") }}
            <strong>{{ log.activity.details.newName }}</strong>
          </div>
        </div>
      </transition>

      <div class="meta">
        <span class="badge" :class="log.activity.class">
          {{ $t(log.activity.badgeKey) }}
        </span>

        <span class="user">
          {{ log.activity.userEmail }}
        </span>
      </div>
    </div>

    <div class="arrow">
      <BIMDataIconChevron fill color="default" size="xxs" :rotate="isOpen ? 90 : 0" />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  props: {
    log: {
      type: Object,
      required: true,
    },
    formatTimeAgo: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const isOpen = ref(false);

    const toggle = () => (isOpen.value = !isOpen.value);

    return {
      isOpen,
      toggle,
    };
  },
};
</script>

<style scoped src="./ActivityItem.css"></style>
