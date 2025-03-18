// File type groups
const webContentExtensions = [
  '.html', '.htm', '.css', '.js', '.mjs', '.json', '.xml', '.svg', '.shtml', '.php', '.asp', '.aspx', '.jsp'
]

const imageExtensions = [
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.ico', '.bmp', '.tiff', '.avif', '.heic', '.heif', '.raw', '.cr2', '.nef', '.arw', '.psd', '.ai', '.eps', '.svgz', '.jfif', '.jpe'
]

const audioExtensions = [
  '.mp3', '.wav', '.ogg', '.m4a', '.aac', '.wma', '.flac', '.alac', '.aiff', '.au', '.mid', '.midi', '.amr', '.m4r', '.wv', '.ape', '.opus', '.ra', '.rm', '.vox'
]

const videoExtensions = [
  '.mp4', '.webm', '.mov', '.avi', '.wmv', '.flv', '.mkv', '.m4v', '.mpg', '.mpeg', '.3gp', '.3g2', '.m2v', '.mts', '.m2ts', '.vob', '.ogv', '.divx', '.xvid', '.h264', '.h265', '.hevc'
]

const documentExtensions = [
  '.pdf', '.txt', '.rtf', '.md', '.csv', '.epub', '.mobi', '.azw3', '.djvu', '.fb2', '.lit', '.prc', '.pdb', '.xps', '.oxps', '.odt', '.ods', '.odp', '.odg', '.odf'
]

const officeExtensions = [
  '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pps', '.ppsx', '.pot', '.potx', '.xlt', '.xltx', '.dot', '.dotx', '.xlam', '.xlsm', '.xlsb', '.xltm', '.dotm', '.pptm', '.potm'
]

const archiveExtensions = [
  '.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz', '.lzma', '.lz', '.z', '.tgz', '.tbz2', '.txz', '.iso', '.dmg', '.jar', '.war', '.ear', '.sar', '.par', '.phar'
]

const fontExtensions = [
  '.ttf', '.otf', '.woff', '.woff2', '.eot', '.pfa', '.pfb', '.pfm', '.afm', '.dfont', '.ttc', '.fnt', '.fon', '.bdf', '.pcf', '.snf', '.pfr', '.ttc', '.otc'
]

const dataExtensions = [
  '.csv', '.json', '.xml', '.yaml', '.yml', '.toml', '.ini', '.conf', '.config', '.properties', '.env', '.sql', '.sqlite', '.db', '.dbf', '.mdb', '.accdb', '.fdb', '.gdb', '.sdf'
]

const model3DExtensions = [
  '.obj', '.stl', '.gltf', '.glb', '.fbx', '.dae', '.3ds', '.dxf', '.dwg', '.iges', '.igs', '.step', '.stp', '.iges', '.3dm', '.blend', '.max', '.ma', '.mb', '.abc', '.ply', '.off'
]

const mapExtensions = [
  '.geojson', '.kml', '.gpx', '.shp', '.shx', '.dbf', '.prj', '.mif', '.mid', '.tab', '.map', '.osm', '.pbf', '.mbtiles', '.topojson', '.gml', '.dxf', '.dwg', '.dgn', '.mdb', '.gdb'
]

// Merge all extensions into a single array
export const VALID_EXTENSIONS = [
  ...webContentExtensions,
  ...imageExtensions,
  ...audioExtensions,
  ...videoExtensions,
  ...documentExtensions,
  ...officeExtensions,
  ...archiveExtensions,
  ...fontExtensions,
  ...dataExtensions,
  ...model3DExtensions,
  ...mapExtensions
]

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
