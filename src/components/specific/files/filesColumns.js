import { fileExtension } from "../../../utils/files.js";
import i18n from "../../../i18n/index.js";
const { t } = i18n.global;
export default [
  {
    id: "type",
    text: "t.type",
    width: "80px",
    align: "center",
    sortable: true,
    defaultSortOrder: "asc",
    sortFunction: (a, b) => {
      const getFileType = (file) => {
        if (file.nature === 'folder') {
          return 'Folder';
        } else {
          return fileExtension(file.name);
        }
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
    id: "name",
    text: "t.name",
    sortable: true,
    defaultSortOrder: "desc"
  },
  {
    id: "created_by",
    text: "t.createdBy",
    width: "160px",
    align: "center",
    filter: true,
    filterFunction: rowData => rowData ? `${rowData.lastname} ${rowData.firstname}` : t("t.notSpecified"),
  },
  {
    id: "lastupdate",
    text: "t.modifiedOn",
    width: "160px",
    align: "center",
    sortable: true,
    defaultSortOrder: "asc",
    sortFunction: (a, b) => {
      const dateA = new Date(a.updated_at);
      const dateB = new Date(b.updated_at);
      return dateA < dateB ? 1 : -1;
    },
  },
  {
    id: "size",
    text: "t.size",
    width: "100px",
    align: "center",
    sortable: true,
    defaultSortOrder: "asc"
  },
  {
    id: "tags",
    text: "FilesTable.headers.tags",
    width: "120px",
    align: "center",
    filter: true,
    filterKey: "name",
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
