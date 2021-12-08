function getRandomElement(array) {
  const n = Math.round((array.length - 1) * Math.random());
  return array[n];
}

function fullName({ firstname, lastname }) {
  return firstname && lastname && `${firstname} ${lastname}`;
}

export { getRandomElement, fullName };
