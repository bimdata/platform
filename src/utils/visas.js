import { formatToDateObject, regexDate } from "./date";

const isDateConform = date => {
  const dateToCompare = formatToDateObject(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date.match(regexDate) && dateToCompare.getTime() >= today.getTime();
};

export { isDateConform };
