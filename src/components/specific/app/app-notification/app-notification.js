import { ref } from "vue";
import { delay } from "../../../../utils/async.js";

const DEFAULT_TIMEOUT = 5000;
const EMPTY_NOTIFICATION = {
  type: "info",
  title: "",
  message: ""
};

const showNotification = ref(false);
const notification = ref(EMPTY_NOTIFICATION);

const pushNotification = async (notif, timeout = DEFAULT_TIMEOUT) => {
  notification.value = notif;
  showNotification.value = true;
  await delay(timeout);
  showNotification.value = false;
  await delay(100);
  notification.value = EMPTY_NOTIFICATION;
};

export function useAppNotification() {
  return {
    // References
    showNotification,
    notification,
    // Methods
    pushNotification
  };
}
