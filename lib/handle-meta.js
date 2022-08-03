import { responseJson, responseYaml } from "./responses.js";

// handle requests to technical meta endpoints
export async function handleMeta(req, res, schema, routingRules) {
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

    const { pathname } = new URL(req.url.startsWith('http') ? req.url : 'http://localhost' + req.url);

    if (req.method === 'GET' && pathname in handlers) {

        const selectedHandler = handlers[pathname];
        await selectedHandler(res, schema);
        return true;

    } else {

        return false;

    }
}
