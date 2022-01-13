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
  function pad(s) {
    return s < 10 ? "0" + s : s;
  }
  const d = new Date(date);
  return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join("/");
};

const formatDateDDMMYYYHHMM = date => {
  function pad(s) {
    return s < 10 ? "0" + s : s;
  }
  const d = new Date(date);
  const DDMMYYYY = [
    pad(d.getDate()),
    pad(d.getMonth() + 1),
    d.getFullYear()
  ].join("/");
  return `${DDMMYYYY} ${
    d.getHours() < 10 ? `0${d.getHours()}` : d.getHours()
  }:${d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()}`;
};

export {
  formatToDateObject,
  formatDate,
  formatDateDDMMYYY,
  formatDateDDMMYYYHHMM,
  regexDate
};
