import { initHandlers } from './init-handlers.js'
import { handleMeta } from './handle-meta.js'
import { handlePublicFile } from './handle-public.js'
import { handleApi } from './handle-api.js'
import { responseBadRequest } from './responses.js'

export async function routerForSchema (schema, rootDir, handlerDir) {
  const routingRules = await initHandlers(schema, handlerDir)
  return createRouterWithRules(routingRules, schema, rootDir + '')
}

function createRouterWithRules (routingRules, schema, rootDir) {
  return async function handleRequest (req, res, next) {
    const timestamp = new Date().toISOString().split(/[.Z]/g)[0].split('T').join(' ')
    const start = process.hrtime()
    const status =
            await handlePublicFile(req, res, rootDir) ||
            await handleMeta(req, res, schema, routingRules) ||
            await handleApi(req, res, routingRules) ||
            await responseBadRequest(req, res)

    const end = process.hrtime(start)
    const duration = ((end[0] * 1000000000 + end[1]) / 1000000).toFixed(3)

    console.log(`[${timestamp} utc] ${status} ${req.method} ${req.url} (${duration} ms)`)

    if (next instanceof Function) {
      next()
    }

    return status
  }
}
