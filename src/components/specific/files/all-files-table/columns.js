import { fileExtension } from "../../../../utils/files.js";
import i18n from "../../../../i18n/index.js";
import { fullName } from "../../../../utils/users.js";

const { t } = i18n.global;

export default [
  {
    id: "type",
    text: "t.type",
    sortFunction: (a, b) => {
      const getFileType = (file) =>  fileExtension(file.name);
    
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
    id: "name",
    text: "t.name",
  },
  {
    id: "created_by",
    text: "t.createdBy",
    filter: true,
    filterFunction: rowData => rowData ? fullName(rowData) : t("t.notSpecified"),
  },
  {
    id: "lastupdate",
    text: "t.modifiedOn",
    sortable: true,
    defaultSortOrder: "asc",
    sortFunction: (a, b) => {
      const dateA = new Date(a.updated_at);
      const dateB = new Date(b.updated_at);
      return dateA < dateB ? 1 : -1;
    },
  },
  {
    id: "location",
    text: "t.location",
  },
  {
    id: "size",
    text: "t.size",
    sortable: true,
    defaultSortOrder: "asc"
  },
  {
    id: "tags",
    text: "FilesTable.headers.tags",
    filter: true,
    filterKey: "name",
  },
  {
    id: "actions",
    label: " ",
  }
];

export const columnsXXL = ["type", "name", "created_by", "lastupdate", "size", "actions"];

export const columnsXL = ["name", "lastupdate", "size", "actions"];

export const columnsLG = ["name", "size", "actions"];

export const columnsMD = ["name", "actions"];
