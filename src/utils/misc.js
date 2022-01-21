/* eslint-disable */

/**
 * @param { Object } obj
 * @param { string[] } path
 * @param { any } value
 */
function set(obj, path, value) {
  if (typeof obj !== "object") return;

  if (path?.some(property => typeof property !== "string")) {
    throw new Error("Cannot set object. Path must be an array of strings.");
  }

  path?.reduce?.((currentObject, property, i) => {
    if (i === path.length - 1) {
      currentObject[property] = value;
      return currentObject;
    } else {
      if (!currentObject[property] || typeof currentObject[property] !== "object") {
        currentObject[property] = {};
        return currentObject[property];
      } else {
        return currentObject[property];
      }
    }

  }, obj);
}

export { set };
