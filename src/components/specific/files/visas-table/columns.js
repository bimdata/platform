import { fileExtension } from "../../../../utils/files.js";
import i18n from "../../../../i18n/index.js";
const { t } = i18n.global;
export default [
  {
    id: "validationType",
    text: "t.validation",
    width: "155px",
    align: "center",
    filter: true,
  },
  {
    id: "type",
    text: "t.type",
    width: "85px",
    align: "center",
    sortable: true,
    defaultSortOrder: "asc",
    sortFunction: (a, b) => {
      const fileTypeA = fileExtension(a.document.name);
      const fileTypeB = fileExtension(b.document.name);
      return -fileTypeA.localeCompare(fileTypeB);
    },
  },
  {
    id: "file",
    text: "t.file",
    sortable: true,
    defaultSortOrder: "desc",
    sortFunction: (a, b) => {
      const fileNameA = a.document.name;
      const fileNameB = b.document.name;
      return -fileNameA.localeCompare(fileNameB);
    },
  },
  {
    id: "validators",
    text: "t.validator",
    width: "120px",
    align: "left",
    filter: true,
  },
  {
    id: "due_date",
    text: "t.dueDate",
    width: "120px",
    align: "center",
    sortable: true,
    defaultSortOrder: "desc",
    sortFunction: (a, b) => {
      const dateA = new Date(a.deadline);
      const dateB = new Date(b.deadline);
      return dateA < dateB ? 1 : -1;
    },
  },
  {
    id: "location",
    text: "t.location",
    width: "280px",
    align: "left",
  },
  {
    id: "statutType",
    text: "t.status",
    width: "150px",
    align: "center",
    filter: true,
  },
  {
    id: "buttons",
    label: " ",
    width: "150px",
    align: "center",
  },
  {
    id: "actions",
    label: " ",
    width: "50px",
    align: "center",
  },
];

export const columnsXXL = ["file", "validators", "due_date", "location", "statutType", "buttons" ,"actions"];

export const columnsXL = ["file", "location", "statutType", "actions"];

export const columnsLG = ["file", "statutType", "actions"];
