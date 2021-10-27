import { useOrganizations } from "@/state/organizations.js";
import { useProjects } from "@/state/projects.js";
import { useSpaces } from "@/state/spaces.js";
import { useSubscriptions } from "@/state/subscriptions.js";
import { useUser } from "@/state/user.js";

const { loadUser } = useUser();
const {
  retrieveUserOrganizations: loadUserOrganizations,
  retrieveAllOrganizationsSpaces: loadOrganizationsSpaces
} = useOrganizations();
const { loadUserSpaces } = useSpaces();
const { retrieveAllSpacesSubscriptions: loadSpacesSubscriptions } =
  useSubscriptions();
const { loadUserProjects } = useProjects();

let rootResolved = false;

const rootResolver = async () => {
  if (!rootResolved) {
    await loadUser();
    await loadUserOrganizations();
    await loadOrganizationsSpaces();
    await loadUserSpaces();
    await loadSpacesSubscriptions();
    await loadUserProjects();
    rootResolved = true;
  }
};

export default rootResolver;
