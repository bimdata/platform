import { ref } from "vue";

const state = {
  "view-container": { loading: ref(false) }
};

const createLoadingContext = contextID => {
  state[contextID] = { loading: ref(false) };
  return state[contextID].loading;
};

const removeLoadingContext = contextID => {
  delete state[contextID];
};

const useLoadingContext = contextID => {
  return state[contextID].loading;
};

export { createLoadingContext, removeLoadingContext, useLoadingContext };
