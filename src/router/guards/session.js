import { useSession } from "@/composables/session.js";

const { currentView, previousView } = useSession();

export default function sessionGuard(current, previous) {
  currentView.set({
    name: current.name,
    params: current.params
  });
  previousView.set({
    name: previous.name,
    params: previous.params
  });
}
