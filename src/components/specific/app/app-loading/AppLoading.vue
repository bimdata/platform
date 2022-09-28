<template>
  <transition name="fade" mode="out-in">
    <template v-if="loading">
      <AppLoader v-if="loader" />
    </template>
    <template v-else>
      <slot></slot>
    </template>
  </transition>
</template>

<script>
import { useAppLoading } from "./app-loading.js";
import AppLoader from "./AppLoader.vue";

export default {
  components: {
    AppLoader
  },
  props: {
    name: {
      type: String,
      required: true
    },
    loader: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const loading = useAppLoading(props.name);

    return {
      loading
    };
  }
};
</script>
