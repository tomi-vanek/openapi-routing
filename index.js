import { readSchema as read } from "./lib/read-schema.js";
import { routerForSchema as router } from "./lib/router.js";

export async function routerForSchema(schema, dirName) {
  return router(schema, dirName);
}

export async function readSchema(filePath) {
  return read(filePath);
}
