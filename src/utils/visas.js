import { formatToDateObject, regexDate } from "./date.js";

const isDateValid = date => {
  const dateToCompare = formatToDateObject(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date.match(regexDate) && dateToCompare.getTime() >= today.getTime();
};

export { isDateValid };
