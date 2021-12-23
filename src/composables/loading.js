import { ref } from "vue";

// Pre-defined loading contexts
const contexts = Object.freeze({
  viewContainer: "view-container"
});

const state = {};

const useLoadingContext = name => {
  return state[name] ?? (state[name] = ref(false));
};

export { contexts, useLoadingContext };
