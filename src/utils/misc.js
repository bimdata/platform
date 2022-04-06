function snakeToCamel(str) {
  return str
    .split("")
    .reduce(
      (s, c) =>
        s[s.length - 1] === "_" ? s.slice(0, -1) + c.toUpperCase() : s + c,
      ""
    );
}

function toCamelCaseFields(obj) {
  return Object.entries(obj).reduce(
    (res, [key, value]) => ({
      ...res,
      [snakeToCamel(key)]: value
    }),
    {}
  );
}

export { snakeToCamel, toCamelCaseFields };
