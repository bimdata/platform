import { load } from "../../components/specific/app/app-loading/app-loading.js";
import { useAuth } from "../../state/auth.js";
import { useOrganizations } from "../../state/organizations.js";
import { useProjects } from "../../state/projects.js";
import { useSpaces } from "../../state/spaces.js";
import { useSubscriptions } from "../../state/subscriptions.js";
import { useUser } from "../../state/user.js";
import { useInvitations } from "../../state/invitations.js";

const { isAuthenticated } = useAuth();
const { loadUser } = useUser();
const { loadUserOrganizations, loadAllOrganizationsSpaces } = useOrganizations();
const { loadUserSpaces } = useSpaces();
const { loadAllSpacesSubscriptions } = useSubscriptions();
const { loadUserProjects } = useProjects();
const { loadUserInvitations } = useInvitations();

let isDataLoaded = false;

export default async function dataGuard() {
  if (isAuthenticated.value && !isDataLoaded) {
    /**
     * The order in which methods are called is important,
     * because each fn (or group of fn) need the one before to get done in order to be called
     */

    await loadUser();

    await loadUserOrganizations();

    await Promise.all([
      loadUserSpaces(),
      loadUserProjects(),
      loadUserInvitations()
    ]);

    load("spaces-subscriptions", [
      loadAllOrganizationsSpaces().then(() => loadAllSpacesSubscriptions())
    ]);

    isDataLoaded = true;
  }
}
