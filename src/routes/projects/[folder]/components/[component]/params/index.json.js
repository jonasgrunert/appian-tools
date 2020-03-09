import { getComponent } from "../../../../../../data/fileApi";

export async function get(req, res, next) {
  const { folder, component } = req.params;
  const json = await getComponent(folder, component);
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(json.parameter));
}
