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
        -
      </div>

      <transition name="expand">
        <div v-if="isOpen" class="details">
          <div v-if="log.activity.details.path" class="detail detail-path flex items-center">
            <span>{{ $t("ProjectOverview.activity.folderTitle") }}</span>
            <strong>{{ log.activity.details.path }}</strong>
            <BIMDataButton
              color="default"
              fill
              radius
              icon
              @click.stop="
                $emit('go-folder', {
                  id: log.activity.details.folderId,
                  path: log.activity.details.path,
                })
              "
            >
              <BIMDataIconFolderLocation fill color="primary" />
            </BIMDataButton>
          </div>

          <div v-if="log.activity.details.roleKey" class="detail">
            {{ $t("ProjectOverview.activity.roleTitle") }}:
            <span>
              {{ $t(`ProjectOverview.activity.roles.${log.activity.details.roleKey}`) }}
            </span>
          </div>

          <div v-if="log.activity.details.oldPermissionKey" class="detail">
            {{ $t("ProjectOverview.activity.oldPermissionTitle") }}
            <span>
              {{
                $t(`ProjectOverview.activity.permissions.${log.activity.details.oldPermissionKey}`)
              }}
            </span>
          </div>

          <div v-if="log.activity.details.newPermissionKey" class="detail">
            {{ $t("ProjectOverview.activity.newPermissionTitle") }}
            <span>
              {{
                $t(`ProjectOverview.activity.permissions.${log.activity.details.newPermissionKey}`)
              }}
            </span>
          </div>

          <div v-if="log.activity.details.oldName" class="detail">
            {{ $t("ProjectOverview.activity.oldNameTitle") }}
            <span>{{ log.activity.details.oldName }}</span>
          </div>

          <div v-if="log.activity.details.newName" class="detail">
            {{ $t("ProjectOverview.activity.newNameTitle") }}
            <span>{{ log.activity.details.newName }}</span>
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
