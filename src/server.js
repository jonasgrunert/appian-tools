import { createServer } from "http";
import sirv from "sirv";
import polka from "polka";
import compression from "compression";
import { json } from "body-parser";
import * as sapper from "@sapper/server";

const { PORT, NODE_ENV } = process.env;

const server = createServer();

const srv = polka({ server }); // You can also use Express
srv
  .use(json())
  .use(
    compression({ threshold: 0 }),
    sirv("static", { dev: true }),
    sapper.middleware()
  )
  .listen(PORT, err => {
    if (err) console.log("error", err);
  });
