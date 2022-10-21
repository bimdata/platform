function localeDate(date) {
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date - timezoneOffset);
}

export { localeDate };
