import { useProjects } from "@/state/projects.js";
import { useSpaces } from "@/state/spaces.js";
import { useUser } from "@/state/user.js";

let rootResolved = false;

const rootResolver = async () => {
  const { loadUser } = useUser();
  const { loadUserSpaces } = useSpaces();
  const { loadUserProjects } = useProjects();

  if (!rootResolved) {
    await loadUser();
    await loadUserSpaces();
    await loadUserProjects();
    rootResolved = true;
  }
};

export default rootResolver;
