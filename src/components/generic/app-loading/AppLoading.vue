<template>
  <transition name="fade" mode="out-in">
    <template v-if="loading">
      <AppLoader />
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
