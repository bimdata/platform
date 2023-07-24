<template>
  <teleport to="#app-notification-container">
    <transition name="slide-fade-up">
      <div
        class="app-notification"
        :class="`app-notification--${notification.type}`"
        v-show="showNotification"
      >
        <div class="app-notification__icon">
          <BIMDataIcon :name="notifIcons[notification.type]" size="m" />
        </div>
        <div class="app-notification__content">
          <div class="app-notification__content__title">
            {{ notification.title }}
          </div>
          <div class="app-notification__content__message">
            {{ notification.message }}
          </div>
        </div>
        <BIMDataButton
          class="app-notification__btn-close"
          ghost
          rounded
          icon
          @click="showNotification = false"
        >
          <BIMDataIconClose size="xs" />
        </BIMDataButton>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { useAppNotification } from "./app-notification.js";

const notifIcons = {
  info: "information",
  success: "success",
  warning: "warning",
  error: "failed"
};

export default {
  setup() {
    const { showNotification, notification } = useAppNotification();

    return {
      // References
      notification,
      notifIcons,
      showNotification
    };
  }
};
</script>

<style lang="scss" src="./AppNotification.global.scss"></style>
<style scoped lang="scss" src="./AppNotification.scss"></style>
