import { responseJson, responseYaml } from './responses.js'

// handle requests to technical meta endpoints
export async function handleMeta (req, res, schema, routingRules) {
  const handlers = {
    '/meta/schema.json': async (res, schema) => responseJson(res, schema),
    '/meta/schema.yaml': async (res, schema) => responseYaml(res, schema),
    '/meta/info': async (res, schema) => responseJson(res, schema.info),
    '/meta/health': async res => responseJson(res, {
      service: schema.info.title,
      version: schema.info.version,
      timestamp: new Date().toISOString(),
      healthy: true
    }),
    '/meta/routing': async res => responseJson(res, routingRules)
  }

  const { pathname } = new URL(req.url.startsWith('http') ? req.url : 'http://localhost' + req.url)

  if (req.method === 'GET' && pathname in handlers) {
    const selectedHandler = handlers[pathname]
    return await selectedHandler(res, schema)
  } else {
    return false
  }
}

export function endpointsMessage (schema) {
  const endpoints = Object.keys(schema.paths).map(x =>
`  ${x}
${Object.keys(schema.paths[x]).map(m => `      --> ${m}${schemaPathInfo(schema.paths[x][m])}`).join('\n')}`
  ).join('\n\n')

  return `Endpoints of the ${schema.info.title} microservice:
${endpoints}`
}

function schemaPathInfo (schemaPath) {
  if (schemaPath.summary) {
    return `: ${schemaPath.summary}`
  } else if (schemaPath.description) {
    return `: ${schemaPath.description}`
  } else {
    return ''
  }
}