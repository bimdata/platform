import { fileExtension } from "../../../../utils/files.js";
import i18n from "../../../../i18n/index.js";
const { t } = i18n.global;
export default [
  {
    id: "validation",
    text: "t.validation",
    width: "155px",
    align: "center",
  },
  {
    id: "type",
    text: "t.type",
    width: "85px",
    align: "center",
    sortable: true,
    defaultSortOrder: "asc",
    sortFunction: (a, b) => {
      const getFileType = (file) => {
        return fileExtension(file.document.name);
      };
    
      const fileTypeA = getFileType(a);
      const fileTypeB = getFileType(b);
    
      if (fileTypeA < fileTypeB) {
        return 1;
      } else if (fileTypeA > fileTypeB) {
        return -1;
      } else {
        return 0;
      }
    }
  },
  {
    id: "file",
    text: "t.file",
    sortable: true,
    defaultSortOrder: "desc",
    sortFunction: (a, b) => {
      const fileNameA = a.document.name;
      const fileNameB = b.document.name;
    
      if (fileNameA < fileNameB) {
        return 1;
      } else if (fileNameA > fileNameB) {
        return -1;
      } else {
        return 0;
      }
    }
  },
  {
    id: "validator",
    text: "t.validator",
    width: "150px",
    align: "left",
  },
  {
    id: "due_date",
    text: "t.dueDate",
    width: "230px",
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
    id: "status",
    text: "t.status",
    width: "150px",
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
    width: "50px",
    align: "center",
  }
];

export const columnsXL = ["name", "lastupdate", "size", "actions"];

export const columnsLG = ["name", "size", "actions"];
