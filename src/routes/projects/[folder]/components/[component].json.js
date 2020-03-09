import {
  getComponent,
  deleteComponent,
  saveComponent
} from "../../../../data/fileApi";

export async function get(req, res, next) {
  const { folder, component } = req.params;
  const json = await getComponent(folder, component);
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(json));
}

export async function del(req, res, next) {
  const { folder, component } = req.params;
  res.end(JSON.stringify(await deleteComponent(folder, component)));
}

export async function put(req, res, next) {
  const { folder, component } = req.params;
  res.end(JSON.stringify(await saveComponent(folder, component, req.body)));
}
