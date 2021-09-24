import { useProjects } from "@/state/projects.js";
import { useSpaces } from "@/state/spaces.js";
import { useUser } from "@/state/user.js";
import { useOrganizations } from "@/state/organizations.js";

let rootResolved = false;

const rootResolver = async () => {
  const { loadUser } = useUser();
  const { retrieveUserOrganizations: loadUserOrganizations } =
    useOrganizations();
  const { loadUserSpaces } = useSpaces();
  const { loadUserProjects } = useProjects();

  if (!rootResolved) {
    await loadUser();
    await loadUserOrganizations();
    await loadUserSpaces();
    await loadUserProjects();
    rootResolved = true;
  }
};

export default rootResolver;
