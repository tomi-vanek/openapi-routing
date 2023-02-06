import { exists, isDirectory, responseFile } from './responses.js'
import path from 'path'

// TODO: public directories should be configurable
// const publicRoutes = ['/ui', '/assets', '/public']

// handle requests for static files in public directories
export async function handlePublicFile (req, res, rootDir) {
  const { pathname } = new URL(req.url.startsWith('http') ? req.url : 'http://localhost' + req.url)

  rootDir = rootDir ? normalize(rootDir) : ''

  const filePath = path.join(rootDir, normalize(pathname))

  if (await isDirectory(filePath)) {
    ['index.html', 'index.js'].forEach(async file => {
      const fileName = path.join(filePath, file)
      if (await exists(fileName)) {
        return responseFile(req, res, fileName)
      }
    })
  } else {
    return responseFile(req, res, filePath)
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
