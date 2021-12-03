// format input: dd/mm/yyy
function formatToDateObject(date) {
  const decomposedDate = date.split("/");

  let output = new Date(
    +decomposedDate[2],
    decomposedDate[1] - 1,
    +decomposedDate[0]
  ).setHours(0, 0, 0, 0);

  return output;
}

const regexDate = new RegExp(
  /^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4})$/
);

export { formatToDateObject, regexDate };
