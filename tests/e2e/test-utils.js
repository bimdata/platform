const { webcrypto } = require("node:crypto");

// Password generation config
const PWD_LENGTH = 16;
const PWD_CHARS =
  "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function generateLogins() {
  let email = `${webcrypto.randomUUID()}@bimdata.test`;
  let password = webcrypto
    .getRandomValues(new Uint32Array(PWD_LENGTH))
    .reduce((p, byte) => (p += PWD_CHARS[byte % PWD_CHARS.length]), "");

  return { email, password };
}

module.exports = { generateLogins };
