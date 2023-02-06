import YAML from 'yaml'
import fs from 'fs'
import path from 'path'
import { Readable } from 'stream'
import { mimeForExtension } from './mime-types.js'

export async function responseJson (res, data) {
  const status = 200
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.write(JSON.stringify(data, null, 4))
  res.end()
  return status
}

export async function responseYaml (res, data) {
  const status = 200
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.writeHead(status, { 'Content-Type': 'text/yaml' })
  res.write(YAML.stringify(data))
  res.end()
  return status
}

export async function responseText (res, data) {
  const isString = x => Object.prototype.toString.call(x) === '[object String]'

  const status = 200
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.writeHead(status, { 'Content-Type': 'text/plain' })
  res.write(isString(data) ? data : JSON.stringify(data, null, 4) + '\n')
  res.end()
  return status
}

export async function responseBinary (res, data, mime, fileName) {
  const headers = {
    'Content-Type': mime
  }
  if (fileName) {
    headers['Content-Transfer-Encoding'] = 'binary'
    headers['Content-Disposition'] = `attachment; filename="${fileName}"`
  }

  const status = 200
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.writeHead(status, headers)

  const responseData = await data

  if (responseData instanceof Readable) {
    responseData.pipe(res)
  } else {
    res.write(responseData)
    res.end()
  }

  return status
}

export async function responseFile (req, res, fileName) {
  fileName = path.join(fileName)

  if (!await exists(fileName)) {
    return responseNotFound(res, req.url)
  }
  const stat = await fs.promises.lstat(fileName)
  if (stat.isDirectory()) {
    ['/index.html', '/index.js'].forEach(async file => {
      const indexFile = path.join(fileName, file)
      if (await exists(indexFile)) {
        return responseFile(req, res, indexFile)
      }
    })
    return responseNotFound(res, req.url)
  }

  const extension = fileName.split('.').slice(-1) + ''
  const mime = mimeForExtension(extension)

  const status = 200
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.writeHead(status, { 'Content-Type': mime })
  fs.createReadStream(fileName).pipe(res)
  return status
}

export async function responseNotFound (res, fileName) {
  const status = 404
  res.writeHead(status, { 'Content-Type': 'text/plain' })
  res.write(`Not found: ${fileName}
`)
  res.end()
  return status
}

export async function responseBadRequest (req, res) {
  const status = 400
  res.writeHead(status, { 'Content-Type': 'text/plain' })
  res.write(`Bad request: ${req.url}
`)
  res.end()
  return status
}

export async function responseNotImplemented (res, handlerFile, apiRequest) {
  const status = 500
  res.writeHead(status, { 'Content-Type': 'text/plain' })
  res.write(`Handler function not implemented.

Missing handler module: ${handlerFile}
API request: ${JSON.stringify(apiRequest, null, 4)}
`)
  res.end()
  return status
}

// Error with HTTP response status code
export class ErrorWithStatus extends Error {
  constructor (message, status) {
    super(message)

    this.message = message
    this.status = status
    this.name = 'ErrorWithStatus'
  }
};

export async function responseError (res, err) {
  let status = 500

  if (Number.isInteger(err.status)) {
    status = err.status
  }

  res.writeHead(status, { 'Content-Type': 'text/plain' })
  if (err.name) {
    res.write(`${err.name}\n`)
  }
  if (err.message) {
    res.write(`${err.message}\n`)
  }
  if (err.stack) {
    res.write(`${err.stack}\n`)
  }

  res.end()
  return status
}

export async function exists (path) {
  try {
    await fs.promises.access(path)
    return true
  } catch {
    return false
  }
}

export async function isDirectory (path) {
  try {
    const lstat = await fs.promises.lstat(path)
    return lstat.isDirectory()
  } catch {
    return false
  }
}
