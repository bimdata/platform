import { useProjects } from "@/state/projects";
import { useSpaces } from "@/state/spaces";
import { useUser } from "@/state/user";

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
