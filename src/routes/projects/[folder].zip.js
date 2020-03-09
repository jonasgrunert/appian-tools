import { getZip } from "../../data/fileApi";

export async function get(req, res, next) {
  const { folder } = req.params;
  res.setHeader("Content-Type", "application/octet-stream");
  res.end(
    await getZip(
      folder,
      Object.keys(req.query).map(k => ({
        name: k,
        version: req.query[k]
      }))
    )
  );
}
