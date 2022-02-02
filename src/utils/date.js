// format input: dd/mm/yyy
function formatToDateObject(date) {
  const decomposedDate = date.split("/");

  const output = new Date(
    +decomposedDate[2],
    decomposedDate[1] - 1,
    +decomposedDate[0]
  );

  output.setHours(0, 0, 0, 0);

  return output;
}

const regexDate = new RegExp(
  /^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4})$/
);

// from dd/mm/yyy (string) to yyyy-mm-dd (date Object)
const formatDate = date => new Date(date.split("/").reverse().join("-"));

const formatDateDDMMYYY = date => {
  return date.toLocaleString("fr-FR", {
    dateStyle: "short"
  });
};

export { formatToDateObject, formatDate, formatDateDDMMYYY, regexDate };
