import { initHandlers } from './init-handlers.js';
import { responseNotFound, responseNotImplemented, responseError, responseJson, responseBinary } from './responses.js';
import { handleMeta } from './handle-meta.js';
import { parseRequest, normalizedParamEntities } from './parse-request.js';


export async function routerForSchema(schema, dirNameForHandlers) {
  const routingRules = await initHandlers(schema, dirNameForHandlers);
  return createRouterWithRules( routingRules, schema );
}

function createRouterWithRules( routingRules, schema ) {

  return async function handleRequest(req, res) {

    const apiRequest = await parseRequest(req);
  
    // Request to technical meta endpoints
    if ( await handleMeta(schema, routingRules, apiRequest, res) ) {
      // ... and the request was processed by meta-request handler,
      //  so no need to continue with routing rules
      return;
    }
  
    // Find the routing rule for request path
    const ruleForRequest = routingRules.find( routingFor( apiRequest ) );
  
    if ( ! ruleForRequest ) {
      // bad request: request path not in schema
      await responseNotFound(res, apiRequest.url);
  
    } else if ( ! ruleForRequest.handler ) {
      // missing handler module
      await responseNotImplemented(res, ruleForRequest.handlerFile, apiRequest);
  
    } else {
  
      try {
  
        // Prepare parameters
        const params = {
          ... apiRequest.searchParams,
          ... apiRequest.pathParams,
        };
  
        // Request to an endpoint of the REST microservice - calling the request handler
        const functionName = `handle${apiRequest.method.slice(0, 1)}${apiRequest.method.slice(1).toLowerCase()}`;
        const result = await ruleForRequest.handler[functionName](params, apiRequest.data);
  
        // ... and send the result in response
        if ('mime' in result) {
          // send in mime type format
          await responseBinary(res, result.data, result.mime);
        } else {
          // default is JSON response
          await responseJson(res, result);
  
        }
  
      } catch (err) {
  
        // ... in case of error send the error message in response
        await responseError(res, err);
  
      }
    }
  
  };
  
}

function routingFor( apiRequest ) {
  return x => {
    const serverPath = x.servers.find(p => apiRequest.pathname.startsWith(p));

    if (!serverPath) {
      return false;
    } else {
      const reqPath = apiRequest.pathname.slice(serverPath.length);
      const matched = new RegExp(x.regexp).exec(reqPath);

      if (matched && matched.groups) {
        const params = Object.fromEntries( normalizedParamEntities( Object.entries( matched.groups ) ) );
        apiRequest['pathParams'] = params;
      }

      return !!matched;
    }
  };
}

