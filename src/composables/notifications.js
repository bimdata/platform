import { ref } from "vue";
import { delay } from "@/utils/async";

const showNotification = ref(false);
const notification = ref({});

const pushNotification = async (notif, timeout = 5000) => {
  notification.value = notif;
  showNotification.value = true;
  await delay(timeout);
  showNotification.value = false;
  notification.value = {};
};

export function useNotifications() {
  return {
    // References
    showNotification,
    notification,
    // Methods
    pushNotification
  };
}
