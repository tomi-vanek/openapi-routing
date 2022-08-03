import { initHandlers } from './init-handlers.js';
import { handleMeta } from './handle-meta.js';
import { handlePublicFile } from './handle-public.js';
import { handleApi } from './handle-api.js';
import { responseBadRequest } from './responses.js';

export async function routerForSchema(schema, rootDir, handlerDir) {
    const routingRules = await initHandlers(schema, handlerDir);
    return createRouterWithRules(routingRules, schema, rootDir + '');
}

function createRouterWithRules(routingRules, schema, rootDir) {

    return async function handleRequest(req, res) {
        const requestWasHandled =
            await handlePublicFile(req, res, rootDir) ||
            await handleMeta(req, res, schema, routingRules) ||
            await handleApi(req, res, routingRules);

        if ( ! requestWasHandled ) {
            await responseBadRequest( res );
        }
    };
}
