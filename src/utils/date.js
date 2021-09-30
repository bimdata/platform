<<<<<<< HEAD
function formatDate(value) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const date = new Date(value);
  return (
    date.getDate() +
    " " +
    monthNames[date.getMonth()] +
    " " +
    date.getFullYear()
  );
=======
/**
 * Change an ISO formatted date into a date with formatted as: DD/MM/YYYY.
 *
 * @param {String} date an ISO formatted date string
 * @returns {String} formatted date
 */
function formatDate(date) {
  const d = date.split("T")[0];
  return d.split("-").reverse().join("/");
>>>>>>> 8f347fc (feat(organizations): create organization management panel on user spaces view)
}

export { formatDate };
