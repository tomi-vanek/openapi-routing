import path from 'path'

import { exists, responseFile } from './responses.js'
import { VALID_EXTENSIONS } from './mime-types.js'

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

  if (!isFileSafeToServe(filePath, rootDir)) {
    return false
  }

  return await exists(filePath) ? responseFile(req, res, filePath) : false
}

// Check if file is safe to serve
function isFileSafeToServe (filePath, rootDir) {
  // Prevent serving hidden files (starting with dot)
  const fileName = path.basename(filePath)
  if (fileName.startsWith('.')) {
    return false
  }

  // Check if file extension is in the allowed list
  const ext = path.extname(filePath).toLowerCase()
  if (!VALID_EXTENSIONS.includes(ext)) {
    return false
  }

  // Prevent directory traversal by ensuring filePath is within rootDir
  const resolvedPath = path.resolve(filePath)
  const resolvedRoot = path.resolve(rootDir)
  if (!resolvedPath.startsWith(resolvedRoot)) {
    return false
  }

  return true
}

// Normalize file name to ensure it's safe to serve
function normalize (fileName) {
  fileName = fileName ? fileName + '' : ''
  if (fileName.endsWith('/')) {
    // remove ending slash character
    fileName = fileName.substring(0, fileName.length - 1)
  }

  return fileName
}
