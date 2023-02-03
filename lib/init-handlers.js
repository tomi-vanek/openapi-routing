import path from 'path'
import { promises as fsPromises } from 'fs'

export async function initHandlers (schema, handlerDir) {
  if (handlerDir.endsWith('/')) {
    // remove ending slash character
    handlerDir = handlerDir.substring(0, handlerDir.length - 1)
  }

  const servers = schema.servers ? schema.servers.map(extractPath).filter(onlyUnique) : []

  const definitions = await Promise.all(
    Object.entries(schema.paths).map(processPathEntry(handlerDir, servers))
  )

  // sorted - deeper levels have precedense
  return definitions.sort((a, b) =>
    b.level === a.level ? b.path.length - a.path.length : b.level - a.level)
}

function processPathEntry (handlerDir, servers) {
  return async ([key, value]) => {
    const handlerFile = (key.startsWith('/') ? '' : '/') +
            (key.endsWith('/') ? key + 'index.js' : key + '.js')

    const handlerPath = path.join(handlerDir, handlerFile)
    const methods = Object.keys(value).map(x => x.toUpperCase())
    const handler = await attachHandlerModule(handlerPath)
    const level = key.length - key.replaceAll('/', '').length
    const regexp = regexForPath(key)

    return {
      path: key,
      regexp,
      level,
      handlerFile,
      handlerPath,
      methods,
      handler,
      servers
    }
  }
}

function extractPath (server) {
  const re = /(https?:\/\/[^/]+)?(?<path>.*)/g
  const result = server.url ? re.exec(server.url) : null
  return result && result.groups && result.groups.path ? result.groups.path : ''
}

async function attachHandlerModule (filePath) {
  const fileExists = async path => !!(await fsPromises.stat(path).catch(e => false))
  if (await fileExists(filePath)) {
    const importPath = filePath.toLowerCase().startsWith('file://') ? filePath : `file://${filePath}`
    return await import(importPath)
  } else {
    return null
  }
}

function regexForPath (reqPath) {
  const re = reqPath
    .replaceAll('.', '.')
    .replaceAll('/', '/')
    .replaceAll('{', '(?<')
    .replaceAll('}', '>[^/]+)')

  return re
}

function onlyUnique (value, index, self) {
  return self.indexOf(value) === index
}
