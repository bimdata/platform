function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function debounce(callback, ms) {
  let timeoutID = null;
  return (...args) => {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => callback(...args), ms);
  };
}

export { delay, delay as wait, debounce };
