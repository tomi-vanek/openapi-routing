import { parseRequest } from './parse-request.js';
import { responseNotFound, responseNotImplemented, responseError, responseJson, responseBinary } from './responses.js';
import { normalizedParamEntities } from './parse-request.js';

// handle API calls
export async function handleApi( req, res, routingRules ) {
    const apiRequest = await parseRequest(req);

    // Find the routing rule for request path
    const ruleForRequest = routingRules.find(routingFor(apiRequest));

    if (!ruleForRequest) {
        // request path not in schema
        return await responseNotFound(res, apiRequest.url);
    } else if (!ruleForRequest.handler) {
        // missing handler module
        return await responseNotImplemented(res, ruleForRequest.handlerFile, apiRequest);
    } else {

        try {

            // Prepare parameters
            const params = {
                ...apiRequest.searchParams,
                ...apiRequest.pathParams,
            };

            // decode params comming from URL
            Object.keys(params).forEach(key => {
                if (typeof params[key] === 'string') {
                    params[key] = decodeURIComponent(params[key]);
                }
            })

            // Request to an endpoint of the REST microservice - calling the request handler
            const functionName = `handle${apiRequest.method.slice(0, 1)}${apiRequest.method.slice(1).toLowerCase()}`;
            const result = await ruleForRequest.handler[ functionName ](params, apiRequest.data, apiRequest.contentType);

            // ... and send the result in response
            if ('mime' in result) {
                // send in mime type format
                return await responseBinary(res, result.data, result.mime, result.fileName);
            } else {
                // default is JSON response
                return await responseJson(res, result);
            }

        } catch (err) {

            // ... in case of error send the error message in response
            return await responseError(res, err);

        }
    }
}

function routingFor(apiRequest) {
    return x => {
        const serverPath = x.servers.find(p => apiRequest.pathname.startsWith(p));

        if (x.servers.length && !serverPath) {
            return false;
        } else {
            const reqPath = apiRequest.pathname.slice(serverPath.length);
            const matched = new RegExp(x.regexp).exec(reqPath);

            if (matched && matched.groups) {
                const params = Object.fromEntries( normalizedParamEntities(Object.entries(matched.groups)) );
                apiRequest['pathParams'] = params;
            }

            return !!matched;
        }
    };
}
