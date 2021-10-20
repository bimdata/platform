import { useSpaces } from "@/state/spaces.js";
import { createViewResolver } from "../view-resolver-factory.js";

export default createViewResolver(async route => {
  const spaces = useSpaces();
  spaces.selectSpace(+route.params.spaceID);
});
