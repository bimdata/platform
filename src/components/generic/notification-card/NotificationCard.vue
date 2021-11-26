<template>
  <teleport to="#notification-container">
    <transition name="slide-fade-up">
      <div
        class="notification-card"
        :class="`notification-card--${notification.type}`"
        v-show="showNotification"
      >
        <div class="notification-card__icon">
          <BIMDataIcon :name="notifIcons[notification.type]" size="m" />
        </div>
        <div class="notification-card__text">
          <div class="notification-card__text__title">
            {{ notification.title }}
          </div>
          <div class="notification-card__text__message">
            {{ notification.message }}
          </div>
        </div>
        <BIMDataButton
          class="notification-card__btn-close"
          ghost
          rounded
          icon
          @click="showNotification = false"
        >
          <BIMDataIcon name="close" size="xs" />
        </BIMDataButton>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { useNotifications } from "@/composables/notifications";

const notifIcons = {
  info: "information",
  success: "success",
  warning: "warning",
  error: "failed"
};

export default {
  setup() {
    const { showNotification, notification } = useNotifications();

    return {
      // References
      notification,
      notifIcons,
      showNotification
    };
  }
};
</script>

<style scoped lang="scss" src="./NotificationCard.scss"></style>
