import { ref } from "vue";

// Pre-defined loading contexts
const contexts = Object.freeze({
  viewContainer: "view-container"
});

const state = {
  [contexts.viewContainer]: { loading: ref(false) }
};

const createLoadingContext = context => {
  state[context] = { loading: ref(false) };
  return state[context].loading;
};

const removeLoadingContext = context => {
  delete state[context];
};

const useLoadingContext = context => {
  return state[context].loading;
};

export {
  contexts,
  createLoadingContext,
  removeLoadingContext,
  useLoadingContext
};
