import { exists, responseFile } from './responses.js'
import path from 'path'

// TODO: public directories should be configurable
// const publicRoutes = ['/ui', '/assets', '/public']

// handle requests for static files in public directories
export async function handlePublicFile (req, res, rootDir) {
  const { pathname } = new URL(req.url.startsWith('http') ? req.url : 'http://localhost' + req.url)

  rootDir = rootDir ? normalize(rootDir) : ''

  const fileName = path.join(rootDir, pathname)
  if (await exists(fileName)) {
    return responseFile(res, fileName)
  }

  const indexHtml = path.join(fileName, 'index.html')
  if (await exists(indexHtml)) {
    return responseFile(res, indexHtml)
  }

  const indexJs = path.join(fileName, 'index.js')
  if (await exists(indexHtml)) {
    return responseFile(res, indexJs)
  }

  // not found - forward control to next handler in cascade
  return false
}

function normalize (fileName) {
  fileName = fileName ? fileName + '' : ''
  if (fileName.endsWith('/')) {
    // remove ending slash character
    fileName = fileName.substring(0, fileName.length - 1)
  }

  return fileName
}
