import { responseJson, responseYaml } from "./responses.js";

export function handleMeta(schema, apiRequest, res) {
  if (apiRequest.method === 'GET') {
    if (apiRequest.pathname === '/meta/schema.json') {
      responseJson(res, schema);
      return true;
    }
    if (apiRequest.pathname === '/meta/schema.yaml') {
      responseYaml(res, schema);
      return true;
    }
    if (apiRequest.pathname === '/meta/info') {
      responseJson(res, schema.info);
      return true;
    }
    if (apiRequest.pathname === '/meta/health') {
      responseJson(res, {
        timestamp: new Date().toISOString(),
        healthy: true,
      });
      return true;
    }
  }
  return false;
}
