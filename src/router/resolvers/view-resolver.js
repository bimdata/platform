import { contexts, useLoadingContext } from "@/composables/loading";

/**
 * Create a view resolver from a given promise
 * by wrapping it with loading logic.
 *
 * @param {Promise} resolve
 * @returns {Promise}
 */
const createViewResolver = resolve => {
  return async route => {
    const loading = useLoadingContext(contexts.viewContainer);
    loading.value = true;
    await resolve(route);
    loading.value = false;
  };
};

export { createViewResolver };
