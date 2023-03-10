function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function debounce(callback, ms) {
  let timeoutID = null;
  return function () {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => callback(...arguments), ms);
  };
}

export { delay, delay as wait, debounce };
