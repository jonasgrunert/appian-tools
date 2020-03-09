import { getHTML } from "../../../../../data/fileApi";

export async function get(req, res, next) {
  const { folder, component } = req.params;
  await getHTML(folder, component);
  res.end("Bundled");
}
