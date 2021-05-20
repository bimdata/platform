<script>
import { onMounted } from "vue";
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

    onMounted(() => {
      targetSlot.value = slots.default;
    });
  },
  render() {
    return [];
  }
};
</script>
