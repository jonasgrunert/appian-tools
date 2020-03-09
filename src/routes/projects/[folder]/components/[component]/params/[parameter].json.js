import { deleteParameter, saveParameter } from "../../../../../../data/fileApi";

export async function del(req, res, next) {
  const { folder, component, parameter } = req.params;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(await deleteParameter(folder, component, parameter)));
}

export async function put(req, res, next) {
  const { folder, component, parameter } = req.params;
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify(await saveParameter(folder, component, parameter, req.body))
  );
}
