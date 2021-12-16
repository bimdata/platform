import { useAuth } from "@/state/auth.js";
import { useOrganizations } from "@/state/organizations.js";
import { useProjects } from "@/state/projects.js";
import { useSpaces } from "@/state/spaces.js";
import { useSubscriptions } from "@/state/subscriptions.js";
import { useUser } from "@/state/user.js";

const { isAuthenticated } = useAuth();
const { loadUser } = useUser();
const { loadUserOrganizations, loadAllOrganizationsSpaces } =
  useOrganizations();
const { loadUserSpaces } = useSpaces();
const { loadAllSpacesSubscriptions } = useSubscriptions();
const { loadUserProjects } = useProjects();

let dataLoaded = false;

export default async function dataGuard() {
  if (isAuthenticated.value && !dataLoaded) {
    // Note: the order in which methods are called is important !

    await loadUser();
    await loadUserOrganizations();
    await loadUserSpaces();
    await loadUserProjects();

    await loadAllOrganizationsSpaces();
    await loadAllSpacesSubscriptions();

    dataLoaded = true;
  }
}
