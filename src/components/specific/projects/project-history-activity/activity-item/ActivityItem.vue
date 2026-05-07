<template>
  <div class="activity-item" @click="toggle">
    <div class="icon" :class="log.activity.class">
      <BIMDataIcon :name="log.activity.icon" size="xxs" />
    </div>

    <div class="content">
      <div class="title">
        {{ $t(log.activity.actionKey, log.activity.params) }}
        <span v-if="log.activity.target" class="primary">
          {{ log.activity.target }}
        </span>
      </div>

      <div class="date">
        {{ formatTimeAgo(log.dateObj) }}
      </div>

      <transition name="expand">
        <div v-if="isOpen" class="details">
          <div v-if="log.activity.details.path" class="detail flex items-center">
            Dossier: <span>{{ log.activity.details.path }}</span>
            <BIMDataButton
              color="default"
              fill
              radius
              icon
              class="m-l-6"
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
            Rôle:
            <span>
              {{ $t(`ProjectOverview.activity.roles.${log.activity.details.roleKey}`) }}
            </span>
          </div>

          <div v-if="log.activity.details.newPermissionKey" class="detail">
            Nouveau droit:
            <span>
              {{
                $t(`ProjectOverview.activity.permissions.${log.activity.details.newPermissionKey}`)
              }}
            </span>
          </div>

          <div v-if="log.activity.details.oldPermissionKey" class="detail">
            Ancien droit:
            <span>
              {{
                $t(`ProjectOverview.activity.permissions.${log.activity.details.oldPermissionKey}`)
              }}
            </span>
          </div>

          <div v-if="log.activity.details.oldName" class="detail">
            Ancien nom: <span>{{ log.activity.details.oldName }}</span>
          </div>

          <div v-if="log.activity.details.newName" class="detail">
            Nouveau nom: <span>{{ log.activity.details.newName }}</span>
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
