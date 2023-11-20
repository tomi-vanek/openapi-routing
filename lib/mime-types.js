// just a selected subset of file types
const mimeTypes = {
  // basic web types
  html: 'text/html',
  css: 'text/css',
  js: 'text/javascript',
  mjs: 'text/javascript',
  json: 'application/json',
  yaml: 'application/yaml',
  xml: 'text/xml',
  xsl: 'text/xsl',
  xslt: 'text/xsl',

  // images
  png: 'image/png',
  svg: 'image/svg+xml',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  bmp: 'image/bmp',
  tiff: 'image/tiff',

  // document types
  txt: 'text/plain',
  csv: 'text/csv',
  md: 'text/markdown',
  pdf: 'application/pdf',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  epub: 'application/epub+zip',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  odt: 'application/vnd.oasis.opendocument.text',
  ods: 'application/vnd.oasis.opendocument.spreadsheet',
  odp: 'application/vnd.oasis.opendocument.presentation',

  // 3D file formats
  gltf: 'model/gltf+json',
  glb: 'model/gltf-binary',
  obj: 'model/obj',
  stl: 'model/stl',
  fbx: 'application/octet-stream',
  usdz: 'model/vnd.usdz+zip',

  // fonts
  otf: 'font/otf',
  ttf: 'font/ttf',

  // video
  mp4: 'video/mp4',
  mpeg: 'video/mpeg',
  263: 'video/H263',

  // audio
  mp3: 'audio/mpeg',
  wav: 'audio/wav',

  // compressed
  zip: 'application/zip',
  rar: 'application/vnd.rar',
  '7z': 'application/x-7z-compressed',
  gz: 'application/gzip',
  tar: 'application/x-tar',

  // if unknown - fallback to binary format
  bin: 'application/octet-stream'
}

export function mimeForExtension (extension) {
  extension = extension ? extension.toLowerCase() : mimeTypes.bin
  return mimeTypes[extension] || mimeTypes.bin
}
