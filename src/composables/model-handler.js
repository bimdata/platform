import ModelHandler from "@/server/ModelHandler";

export function useModelHandler(model) {
  const modelHandler = new ModelHandler();
  modelHandler.load(model);
  return modelHandler;
}
