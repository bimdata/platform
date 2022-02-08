function fullName({ firstname, lastname }) {
  return firstname && lastname && `${firstname} ${lastname}`;
}

export { fullName };
