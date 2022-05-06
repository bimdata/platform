const defaultFormats = {
  short: {
    year: "numeric",
    month: "numeric",
    day: "numeric"
  },
  long: {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric"
  }
};

const datetimeFormats = {
  de: defaultFormats,
  en: defaultFormats,
  es: defaultFormats,
  fr: defaultFormats,
  it: defaultFormats,
  nl: defaultFormats,
  no: defaultFormats
};

export default datetimeFormats;
