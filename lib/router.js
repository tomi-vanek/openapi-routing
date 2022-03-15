import { initHandlers } from './init-handlers.js';
import { responseNotFound, responseNotImplemented, responseError, responseJson } from './responses.js';
import { handleMeta } from './handle-meta.js';
import { parseRequest } from './parse-request.js';

export async function routerForSchema(schema, dirName) {
  const pathConfig = await initHandlers(schema, dirName);

  console.log(JSON.stringify(pathConfig, null, 4));

  return handleRequest;

  async function handleRequest(req, res) {
    const apiRequest = await parseRequest(req);
    if (handleMeta(schema, apiRequest, res)) {
      return;
    }

    const rootConfig = pathConfig
      .find(x => {
        const serverPath = x.servers.find(p => apiRequest.pathname.startsWith(p));
        if (!serverPath) {
          return false;
        } else {
          const reqPath = apiRequest.pathname.slice(serverPath.length);
          const matched = new RegExp(x.regexp).exec(reqPath);
          if (matched && matched.groups) {
            apiRequest['pathParams'] = matched.groups;
          }
          return !! matched;
        }
      });

    if ( !rootConfig ) {
      await responseNotFound(res, apiRequest.url);
    } else if ( !rootConfig.handler ) {
      await responseNotImplemented(res, rootConfig.handlerFile, apiRequest);
    } else {
      try {
        const params = {
          ... apiRequest.searchParams,
          ... apiRequest.pathParams,
        };
        const functionName = `handle${apiRequest.method.slice(0, 1)}${apiRequest.method.slice(1).toLowerCase()}`;
        const result = await rootConfig.handler[functionName](params, apiRequest.data);
        await responseJson(res, result);
      } catch (err) {
        await responseError(res, err);
      }
    }

  }
}
