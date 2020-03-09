import { promises } from "fs";
import { parse } from "fast-xml-parser";
import { getFile } from "../../data/fileApi";

export async function get(req, res, next) {
  const dirs = await promises.readdir("./");
  const xmls = await Promise.all(
    dirs.map(async folder => ({
      name: `./${folder}`,
      stats: await promises.stat(`./${folder}`)
    }))
  )
    .then(stats => stats.filter(s => s.stats.isDirectory()))
    .then(file =>
      Promise.all(
        file.map(async f => {
          try {
            return await getFile(f.name);
          } catch (e) {
            return false;
          }
        })
      )
    )
    .then(files => files.filter(f => f));
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(xmls));
}
