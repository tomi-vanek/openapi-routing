import { promises as fsPromises } from 'fs';

export async function initHandlers(schema, dirName) {
  if (dirName.endsWith('/')) {
    // remove ending slash character
    dirName = dirName.substring(0, dirName.length() - 1);  
  }

  const servers = schema.servers.map( extractPath ).filter( onlyUnique );

  const definitions = await Promise.all(
    Object.entries(schema.paths).map( processPathEntry(dirName, servers) )
  );

  // sorted - deeper levels have precedense
  return definitions.sort((a, b) => b.level - a.level);
}

function processPathEntry(dirName, servers) {
  return async ([key, value]) => {
    const handlerFile = (key.startsWith('/') ? '' : '/') +
        (key.endsWith('/') ? key + 'index.js' : key + '.js');
  
    const handlerPath = dirName + handlerFile;
  
    const methods = Object.keys(value).map(x => x.toUpperCase());
  
    const handler = await attachHandlerModule(handlerPath);
  
    const level = key.length - key.replaceAll('/', '').length;
  
    const regexp = regexForPath(key);
  
    return {
      path: key,
      regexp,
      level,
      handlerFile,
      handlerPath,
      methods,
      handler,
      servers,
    };
  };
}

function extractPath(server) {
  const re = /(https?:\/\/[^\/]+)?(?<path>.*)/g;
  const result = server.url ? re.exec(server.url) : null;
  return result && result.groups && result.groups.path ? result.groups.path : '';
}

async function attachHandlerModule(filePath) {
  const fileExists = async path => !!(await fsPromises.stat(path).catch(e => false));
  return await fileExists(filePath) ? await import(filePath) : null;
}

function regexForPath(reqPath) {
  const re = reqPath
    .replaceAll('.', '\.')
    .replaceAll('/', '\/')
    .replaceAll('{', '(?<')
    .replaceAll('}', '>[^./]+)')
    ;
  return re;
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
