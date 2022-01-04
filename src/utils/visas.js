import { useProjects } from "@/state/projects";
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

export { getUnmatchedUsers };
