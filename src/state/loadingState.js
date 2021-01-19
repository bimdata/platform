import { ref } from 'vue';

const state = {};

const createLoadingContext = (contextID) => {
  state[contextID] = { loading: ref(false) };
  return state[contextID].loading;
};

const removeLoadingContext = (contextID) => {
  delete state[contextID];
};

const useLoadingContext = (contextID) => state[contextID].loading;

export {
  createLoadingContext,
  removeLoadingContext,
  useLoadingContext
};
