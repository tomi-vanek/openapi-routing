import YAML from 'yaml'
import fs from 'fs';
import { Readable } from 'stream';

export async function responseJson(res, data) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify(data, null, 4));
  res.end();
}

export async function responseYaml(res, data) {
  res.writeHead(200, { 'Content-Type': 'text/yaml' });
  res.write(YAML.stringify(data));
  res.end();
}

export async function responseText(res, data) {
  const isString = x => Object.prototype.toString.call(x) === "[object String]";

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write(isString(data) ? data : JSON.stringify(data, null, 4) + '\n');
  res.end();
}

export async function responseBinary(res, data, mime) {
  res.writeHead(200, { 'Content-Type': mime });

  const responseData = await data;
  if (responseData instanceof Readable) {
    responseData.pipe(res);
  } else {
    res.write(responseData);
    res.end();
  }
}

export async function responseFile(res, fileName) {
  if (exists(fileName)) {
    // just selected subset of common file types in simple web applications
    const mimeTypes = {
      "html": "text/html",
      "css": "text/css",
      "js": "text/javascript",
      "json": "application/json",
      "yaml": "application/yaml",
      "png": "image/png",
      "svg": "image/svg+xml",
      "jpeg": "image/jpeg",
      "jpg": "image/jpeg",
      "txt": "image/text",
      "md": "text/markdown",
      "pdf": "application/pdf",
    };

    const suffix = fileName.split('.').slice(-1) + "";
    const mime = (suffix && suffix in mimeTypes) ? mimeTypes[suffix.toLowerCase()] : mimeTypes['txt'];

    res.writeHead(200, { 'Content-Type': mime });
    fs.createReadStream(fileName).pipe(res);

  } else {
    await responseNotFound(res, fileName);

  }
}

export async function responseNotFound(res, fileName) {
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.write(`Not found: ${fileName}\n`);
  res.end();
}

export async function responseNotImplemented(res, handlerFile, apiRequest) {
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.write('Handler function not implemented.\n\n');
  res.write(`Missing handler module: ${handlerFile}\n\n`);
  res.write(`API request: ${JSON.stringify(apiRequest, null, 4)}\n`);
  res.end();
}

export async function responseError(res, err) {
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.write(`${err.stack}\n`);
  res.end();
}

async function exists(path) {
  try {
    await fs.promises.access(path);
    return true;
  } catch {
    return false;
  }
}
