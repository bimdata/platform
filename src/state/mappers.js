import PROJECT_ROLES from "@/config/project-roles.js";
import SPACE_ROLES from "@/config/space-roles.js";
import { useUser } from "@/state/user.js";
import { status } from "@/utils/projects.js";

const { user: currentUser, spaceRoles, projectRoles } = useUser();

function mapSpaces(spaces, freeSpaces) {
  const freeSpacesIDs = freeSpaces.map(s => s.id);
  const result = spaces.map(space => ({
    ...space,
    isFree: freeSpacesIDs.includes(space.id),
    isAdmin: spaceRoles.value[space.id] === SPACE_ROLES.ADMIN
  }));
  result.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return result;
}

function mapProjects(projects) {
  const result = projects.map(project => ({
    ...project,
    isAdmin: projectRoles.value[project.id] === PROJECT_ROLES.ADMIN,
    isUser: projectRoles.value[project.id] === PROJECT_ROLES.USER,
    isGuest: projectRoles.value[project.id] === PROJECT_ROLES.GUEST,
    status: status(project)
  }));
  result.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return result;
}

function mapUsers(users) {
  const result = users.map(user => ({
    ...user,
    isSelf: user.userId === currentUser.value.id
  }));
  result.sort((a, b) =>
    `${a.firstname}${a.lastname}` < `${b.firstname}${b.lastname}` ? -1 : 1
  );
  return result;
}

export { mapSpaces, mapProjects, mapUsers };
