import { load } from "../../components/specific/app/app-loading/app-loading.js";
import { useAuth } from "../../state/auth.js";
import { useOrganizations } from "../../state/organizations.js";
import { useProjects } from "../../state/projects.js";
import { useSpaces } from "../../state/spaces.js";
import { useSubscriptions } from "../../state/subscriptions.js";
import { useUser } from "../../state/user.js";

const { isAuthenticated } = useAuth();
const { loadUser } = useUser();
const { loadUserOrganizations, loadAllOrganizationsSpaces } =
  useOrganizations();
const { loadUserSpaces } = useSpaces();
const { loadAllSpacesSubscriptions } = useSubscriptions();
const { loadUserProjects } = useProjects();

let isDataLoaded = false;

export default async function dataGuard() {
  if (isAuthenticated.value && !isDataLoaded) {
    // **NOTE** the order in which methods are called is important !

    // 1) Load current user data
    await loadUser();

    // 2) Load organizations of the current user
    await loadUserOrganizations();

    // 3) Load spaces and projects of the current user
    await Promise.all([loadUserSpaces(), loadUserProjects()]);

    // 4) Load lists of orga spaces and space subs (non-blocking)
    load("spaces-subscriptions", [
      loadAllOrganizationsSpaces() // 4.1) load orga spaces
        .then(() => loadAllSpacesSubscriptions()) // 4.2) load space subs
    ]);

    isDataLoaded = true;
  }
}
