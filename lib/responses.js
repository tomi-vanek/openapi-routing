import YAML from 'yaml'
import { ReadStream } from 'fs';

export async function responseJson(res, data) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.write(JSON.stringify(data, null, 4));
  res.end();
}

export async function responseYaml(res, data) {
  res.writeHead(200, {'Content-Type': 'text/yaml'});
  res.write(YAML.stringify(data));
  res.end();
}

export async function responseText(res, data) {
  const isString = x => Object.prototype.toString.call(x) === "[object String]";

  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write(isString(data) ? data : JSON.stringify(data, null, 4) + '\n');
  res.end();
}

export async function responseBinary(res, data, mime) {
  res.writeHead(200, {'Content-Type': mime});

  const responseData = await data;
  if (responseData instanceof ReadStream) {
    responseData.pipe(res);
  } else {
    res.write( responseData );
    res.end();
  }
}

export async function responseNotFound(res, fileName) {
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.write(`Not found: ${fileName}\n`);
  res.end();
}

export async function responseNotImplemented(res, handlerFile, apiRequest) {
  res.writeHead(500, {'Content-Type': 'text/plain'});
  res.write('Handler function not implemented.\n\n');
  res.write(`Missing handler module: ${handlerFile}\n\n`);
  res.write(`API request: ${JSON.stringify(apiRequest, null, 4)}\n`);
  res.end();
}

export async function responseError(res, err) {
  res.writeHead(500, {'Content-Type': 'text/plain'});
  res.write(`${err.stack}\n`);
  res.end();
}
