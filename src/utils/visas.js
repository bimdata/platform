import { formatToDateObject, regexDate } from "./date";

import { useProjects } from "@/state/projects";
import { fullName } from "@/utils/users";

const { fetchFolderProjectUsers } = useProjects();

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
    .filter(({ isSelf }) => !isSelf)
    .map(user => ({
      ...user,
      fullName: fullName(user),
      hasAccess: user.permission >= 50,
      isFindable: true,
      isSelected:
        (validationList &&
          validationList.some(
            ({ validator }) => validator && validator.id === user.id
          )) ||
        false,
      validation:
        (validationList &&
          validationList.find(
            ({ validator }) => validator && validator.id === user.id
          )) ||
        false,
      searchContent: `${user.firstname || ""} ${user.lastname || ""} ${
        user.email || ""
      }`.toLowerCase()
    }));
};

export { isDateConform, getUserList };
