import { promises } from "fs";
import { parse } from "fast-xml-parser";
import { getFile } from "../../../../data/fileApi";

export async function get(req, res, next) {
  const { folder } = req.params;
  const json = await getFile(folder);
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(json.components));
}
