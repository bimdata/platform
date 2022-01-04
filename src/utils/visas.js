import { formatToDateObject, regexDate } from "./date";

import { useProjects } from "@/state/projects";
import { fullName } from "@/utils/users";

const { fetchFolderProjectUsers } = useProjects();

const getUnmatchedUsers = async (visaList, baseInfo) => {
  let allProjectsUsers = new Set();

  visaList.forEach(({ document }) => allProjectsUsers.add(document.parentId));
  allProjectsUsers = Array.from(allProjectsUsers);

  const usersByProjects = await Promise.all(
    allProjectsUsers.map(async folderId => ({
      folderId,
      users: await fetchFolderProjectUsers(
        {
          id: baseInfo.projectPk,
          cloud: {
            id: baseInfo.cloudPk
          }
        },
        { id: folderId }
      )
    }))
  );
  const allVisas = visaList.map(visa => {
    const { users } = usersByProjects.find(
      ({ folderId }) => folderId === visa.document.parentId
    );

    const unMatchedUsers =
      visa.validations.filter(({ validator }) =>
        users.find(
          ({ id, permission }) => id === validator.id && permission === 1
        )
      ) || [];

    return {
      ...visa,
      unMatchedUsers
    };
  });
  return allVisas;
};

const isDateConform = date => {
  const dateToCompare = formatToDateObject(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date.match(regexDate) && dateToCompare.getTime() >= today.getTime();
};

const getUserList = async ({ baseInfo, fileParentId }, validationList) => {
  const res = await fetchFolderProjectUsers(
    {
      id: baseInfo.projectPk,
      cloud: {
        id: baseInfo.cloudPk
      }
    },
    { id: fileParentId }
  );
  return res
    .map(people => ({
      ...people,
      fullName: fullName(people),
      hasAccess: people.permission >= 50,
      isFindable: true,
      isSelected:
        (validationList &&
          validationList.some(({ validator }) => validator.id === people.id)) ||
        false,
      validation:
        (validationList &&
          validationList.find(({ validator }) => validator.id === people.id)) ||
        false,
      searchContent: `${people.firstname || ""}${people.lastname || ""}${
        people.email || ""
      }`.toLowerCase()
    }))
    .filter(({ isSelf }) => !isSelf);
};

export { isDateConform, getUnmatchedUsers, getUserList };
