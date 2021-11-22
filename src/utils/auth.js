function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
  } catch (error) {
    return {};
  }
}

function tokenExp(token) {
  if (token) {
    const parsed = parseJwt(token);
    return parsed.exp ? parsed.exp * 1000 : null;
  }
  return null;
}

function tokenHasExpired(token) {
  const tokenExpiryTime = tokenExp(token);
  if (tokenExpiryTime) {
    return tokenExpiryTime < new Date().getTime();
  }
  return false;
}

export { tokenHasExpired };
