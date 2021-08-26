import { contexts, useLoadingContext } from "@/composables/loading.js";

/**
 * Create a view resolver from a given promise
 * by wrapping it with loading logic.
 *
 * @param {Promise} resolver
 * @returns {Promise}
 */
const createViewResolver = resolver => {
  return async route => {
    const loading = useLoadingContext(contexts.viewContainer);
    loading.value = true;
    await resolver(route);
    loading.value = false;
  };
};

export { createViewResolver };
