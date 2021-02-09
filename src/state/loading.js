import { ref } from "vue";

// Pre-defined loading contexts
const contextIDs = Object.freeze({
  viewContainer: "view-container"
});

const state = {
  [contextIDs.viewContainer]: { loading: ref(false) }
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

export {
  contextIDs,
  createLoadingContext,
  removeLoadingContext,
  useLoadingContext
};
