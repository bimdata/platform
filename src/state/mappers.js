import { PROJECT_ROLE } from "@/config/projects.js";
import { useUser } from "@/state/user.js";
import { projectStatus } from "@/utils/projects.js";
import { useOrganizations } from "@/state/organizations.js";
import { isSpaceAdmin } from "@/utils/spaces";

const { user: currentUser, projectRoles } = useUser();
const { userOrganizations } = useOrganizations();

function mapSpaces(spaces, freeSpaces) {
  const freeSpacesIDs = freeSpaces.map(s => s.id);
  const result = spaces.map(space => ({
    ...space,
    isFree: freeSpacesIDs.includes(space.id),
    isAdmin: isSpaceAdmin(space),
    isUserOrga: Boolean(
      userOrganizations.value.find(orga => orga.id === space.organization.id)
    )
  }));
  result.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
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
  result.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  return result;
}

function mapUsers(users) {
  const result = users.map(user => ({
    ...user,
    isSelf: (user.user_id || user.id) === currentUser.value.id
  }));
  result.sort((a, b) =>
    `${a.firstname}${a.lastname}` < `${b.firstname}${b.lastname}` ? -1 : 1
  );
  return result;
}

export { mapSpaces, mapProjects, mapUsers };
