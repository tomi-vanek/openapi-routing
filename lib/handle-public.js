import { exists, responseFile } from './responses.js'
import path from 'path'

// TODO: public directories should be configurable
// const publicRoutes = ['/ui', '/assets', '/public']

// handle requests for static files in public directories
export async function handlePublicFile (req, res, rootDir) {
  if (req.method !== 'GET') {
    return false
  }
  const reqUrl = new URL(req.url.startsWith('http') ? req.url : 'http://localhost' + req.url)
  rootDir = rootDir ? normalize(rootDir) : ''
  const filePath = path.join(rootDir, normalize(reqUrl.pathname))

  return await exists(filePath) ? responseFile(req, res, filePath) : false
}

function normalize (fileName) {
  fileName = fileName ? fileName + '' : ''
  if (fileName.endsWith('/')) {
    // remove ending slash character
    fileName = fileName.substring(0, fileName.length - 1)
  }

  return fileName
}
