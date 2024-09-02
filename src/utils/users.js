function fullName({ firstname, lastname }) {
  return firstname || lastname ? `${firstname} ${lastname}` : "";
}

function sortUsers(users) {
  return users.sort((a, b) => fullName(a) < fullName(b) ? -1 : 1);
}

export { fullName, sortUsers };
