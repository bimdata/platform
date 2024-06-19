import i18n from "../../../../../i18n/index.js";
const { t } = i18n.global;
export default [
  {
    id: "validation",
    text: "t.validation",
    width: "150px",
    align: "center",
  },
  {
    id: "type",
    text: "t.type",
    width: "80px",
    align: "center",
  },
  {
    id: "file",
    text: "t.file",
    sortable: true,
  },
  {
    id: "validator",
    text: "t.validator",
    width: "270px",
    align: "left",
  },
  {
    id: "due_date",
    text: "t.dueDate",
    width: "230px",
    align: "center",
  },
  {
    id: "status",
    text: "t.status",
    width: "140px",
    align: "center",
  },
  {
    id: "buttons",
    label: " ",
    width: "200px",
    align: "center",
  },
  {
    id: "actions",
    label: " ",
    width: "100px",
    align: "center",
  }
];

export const columnsXL = ["name", "lastupdate", "size", "actions"];

export const columnsLG = ["name", "size", "actions"];
