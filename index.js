import { readSchema as read } from "./lib/read-schema.js";
import { routerForSchema as router } from "./lib/router.js";

export async function routerForSchema(schema, handlerDirName, verbose) {
  return router(schema, handlerDirName, verbose);
}

export async function readSchema(filePath) {
  return read(filePath);
}
