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

export { isDateConform, getUserList };
