import { responseJson, responseYaml } from "./responses.js";

export async function handleMeta(schema, routingRules, apiRequest, res) {
  const handlers = {
    '/meta/schema.json': async (res, schema) => responseJson(res, schema),
    '/meta/schema.yaml': async (res, schema) => responseYaml(res, schema),
    '/meta/info': async (res, schema) => responseJson(res, schema.info),
    '/meta/health': async (res, schema) => responseJson(res, {
        timestamp: new Date().toISOString(),
        healthy: true
    }),
    '/meta/routing': async (res, schema) => responseJson(res, routingRules),
  }
  
  if (apiRequest.method === 'GET' && apiRequest.pathname in handlers) {

    const selectedHandler = handlers[apiRequest.pathname];
    await selectedHandler(res, schema);
    return true;

  } else {

    return false;

  }
}
