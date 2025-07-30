import { ref } from 'vue';

const selectedTime = ref("08:00"); 
const selectedTimezone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone); 

export function useNotificationSchedule() {
  return {
    selectedTime,
    selectedTimezone,
  };
}