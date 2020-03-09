import { getFile, deleteFile, writeFile } from "../../data/fileApi";

export async function get(req, res, next) {
  const { folder } = req.params;
  const xml = await getFile(folder);
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(xml));
}

export async function put(req, res, next) {
  const { folder } = req.params;
  try {
    await writeFile(folder, req.body);
    res.end("Inserted");
  } catch (e) {
    console.error(e);
    res.end("Failed to write file");
  }
}

export async function del(req, res, next) {
  const { folder } = req.params;
  try {
    deleteFile(folder);
    res.end("Deleted");
  } catch (e) {
    console.error(e);
    res.end("Failed to delete plugin");
  }
}
