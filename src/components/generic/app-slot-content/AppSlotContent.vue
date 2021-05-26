<script>
import { onActivated, onBeforeUnmount, onDeactivated, onMounted } from "vue";
import { useAppSlot } from "@/composables/app-slot";

export default {
  props: {
    name: {
      type: String,
      required: true
    }
  },
  setup(props, { slots }) {
    const targetSlot = useAppSlot(props.name);

    const mount = () => (targetSlot.value = slots.default);
    const unmount = () => (targetSlot.value = null);

    onMounted(mount);
    onActivated(mount);

    onDeactivated(unmount);
    onBeforeUnmount(unmount);
  },
  render() {
    return [];
  }
};
</script>
