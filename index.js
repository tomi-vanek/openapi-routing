import { readSchema as read } from './lib/read-schema.js'
import { routerForSchema as router } from './lib/router.js'
import { endpointsMessage as endpoints } from './lib/handle-meta.js'

export async function routerForSchema (schema, rootDir, handlerDir) {
  return await router(schema, rootDir, handlerDir)
}

export async function readSchema (filePath) {
  return await read(filePath)
}

export function endpointsMessage (schema) {
  return endpoints(schema)
}
