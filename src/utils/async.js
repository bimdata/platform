function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function debounce(callback, ms) {
  let timeoutID = null;
  return () => {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(callback, ms);
  };
}

export { delay, delay as wait, debounce };
