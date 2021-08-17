function getRandomElement(array) {
  const n = Math.round((array.length - 1) * Math.random());
  return array[n];
}

export { getRandomElement };
