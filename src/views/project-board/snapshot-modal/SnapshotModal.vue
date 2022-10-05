<template>
  <div class="snapshot-modal" v-click-away="closeModal">
    <img :src="topicSnapshot" />
  </div>
</template>

<script>
import { useAppModal } from "../../../components/specific/app/app-modal/app-modal.js";
export default {
  props: {
    topicSnapshot: {
      type: String
    }
  },
  setup() {
    return { closeModal: useAppModal().closeModal };
  }
};
</script>

<style lang="scss">
.snapshot-modal {
  height: 100%;
  width: fit-content;
  margin: auto;
  display: flex;
  align-items: center;
  img {
    max-width: 100%;
    max-height: calc(100vh - 72px);
    background-color: var(--color-silver-light);
    border-radius: 10px;
  }
}
</style>
