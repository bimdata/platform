import { PROJECT_ROLE } from "@/config/projects.js";
import { SPACE_ROLE } from "@/config/spaces.js";
import { useUser } from "@/state/user.js";
import { projectStatus } from "@/utils/projects.js";

const { user: currentUser, spaceRoles, projectRoles } = useUser();

function mapSpaces(spaces, freeSpaces) {
  const freeSpacesIDs = freeSpaces.map(s => s.id);
  const result = spaces.map(space => ({
    ...space,
    isFree: freeSpacesIDs.includes(space.id),
    isAdmin: spaceRoles.value[space.id] === SPACE_ROLE.ADMIN
  }));
  result.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return result;
}

function mapProjects(projects) {
  const result = projects.map(project => ({
    ...project,
    isAdmin: projectRoles.value[project.id] === PROJECT_ROLE.ADMIN,
    isUser: projectRoles.value[project.id] === PROJECT_ROLE.USER,
    isGuest: projectRoles.value[project.id] === PROJECT_ROLE.GUEST,
    projectStatus: projectStatus(project)
  }));
  result.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return result;
}

function mapUsers(users) {
  const result = users.map(user => ({
    ...user,
    isSelf: (user.userId || user.id) === currentUser.value.id
  }));
  result.sort((a, b) =>
    `${a.firstname}${a.lastname}` < `${b.firstname}${b.lastname}` ? -1 : 1
  );
  return result;
}

export { mapSpaces, mapProjects, mapUsers };
