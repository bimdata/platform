function parseEmails(str) {
  return str.replace(";", ",").split(",").map(email => email.trim());
}

function fullName({ firstname, lastname }) {
  return firstname || lastname ? `${firstname} ${lastname}` : "";
}

function sortUsers(users) {
  return users.sort((a, b) => fullName(a) < fullName(b) ? -1 : 1);
}

export { parseEmails, fullName, sortUsers };
