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

// regex with leap year and february special month
const regexDate = new RegExp(
  /^((([0]?[1-9]|1[0-9]|2[0-8])[./-](0[1-9]|1[012]))|((29|30|31))[./-]((0[13578]|1[02]))|((29|30))[./-](0[4,6,9]|11))[./-]((19|[2-9][0-9])\d\d$|(^29[./-]02[./-](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$))/
);

// from dd/mm/yyy (string) to yyyy-mm-dd (date Object)
const formatDate = date => new Date(date.split("/").reverse().join("-"));

export { formatToDateObject, formatDate, regexDate };
