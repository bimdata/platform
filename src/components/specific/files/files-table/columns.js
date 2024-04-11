import { fileExtension } from "../../../../utils/files.js";
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
    id: "creator",
    text: "t.createdBy",
    width: "160px",
    align: "center",
    sortable: true,
    defaultSortOrder: "asc",
    sortFunction: (a, b) => {
      const fullNameA = `${a.created_by.firstname} ${a.created_by.lastlame}`;
      const fullNameB = `${b.created_by.firstname} ${b.created_by.lastlame}`;
      return fullNameA < fullNameB ? 1 : -1;
    },
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
    id: "actions",
    label: " ",
    width: "50px",
    align: "center",
  }
];

export const columnsXL = ["name", "lastupdate", "size", "actions"];

export const columnsLG = ["name", "size", "actions"];
