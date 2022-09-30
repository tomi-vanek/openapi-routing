import YAML from 'yaml'
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { mimeForExtension } from './mime-types.js';
import { parseRequest } from './parse-request.js';

export async function responseJson(res, data) {
    const status = 200;
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(data, null, 4));
    res.end();
    return status;
}

export async function responseYaml(res, data) {
    const status = 200;
    res.writeHead(status, { 'Content-Type': 'text/yaml' });
    res.write(YAML.stringify(data));
    res.end();
    return status;
}

export async function responseText(res, data) {
    const isString = x => Object.prototype.toString.call(x) === "[object String]";

    const status = 200;
    res.writeHead(status, { 'Content-Type': 'text/plain' });
    res.write(isString(data) ? data : JSON.stringify(data, null, 4) + '\n');
    res.end();
    return status;
}

export async function responseBinary(res, data, mime, fileName) {
    const headers = {
        'Content-Type': mime,
    };
    if (fileName) {
        headers['Content-Transfer-Encoding'] = 'binary';
        headers['Content-Disposition'] = `attachment; filename="${fileName}"`;
    }

    const status = 200;
    res.writeHead(status, headers);
    
    const responseData = await data;

    if (responseData instanceof Readable) {
        responseData.pipe(res);
    } else {
        res.write(responseData);
        res.end();
    }

    return status;
}

export async function responseFile(res, fileName) {
    if (exists(fileName)) {
        const stat = await fs.promises.lstat(fileName);
        if (stat.isDirectory()) {
            if (fileName.endsWith('/')) {
                return responseFile(res, path.join(fileName, 'index.html'));
            } else {
                return responseNotFound(res, fileName);
            }
        }

        const extension = fileName.split('.').slice(-1) + "";
        const mime = mimeForExtension(extension);

        const status = 200;
        res.writeHead(status, { 'Content-Type': mime });
        fs.createReadStream(fileName).pipe(res);
        return status;
    } else {
        return responseNotFound(res, fileName);
    }
}

export async function responseNotFound(res, fileName) {
    const status = 404;
    res.writeHead(status, { 'Content-Type': 'text/plain' });
    res.write(`Not found: ${fileName}
`);
    res.end();
    return status;
}

export async function responseBadRequest(res) {
    const status = 400;
    res.writeHead(status, { 'Content-Type': 'text/plain' });

    const apiRequest = await parseRequest(req);

    res.write(`Bad request: ${req.url}
`);
    res.end();
    return status;
}

export async function responseNotImplemented(res, handlerFile, apiRequest) {
    const status = 500;
    res.writeHead(status, { 'Content-Type': 'text/plain' });
    res.write(`Handler function not implemented.

Missing handler module: ${handlerFile}
API request: ${JSON.stringify(apiRequest, null, 4)}
`);
    res.end();
    return status;
}

export async function responseError(res, err) {
    const status = 500;
    res.writeHead(status, { 'Content-Type': 'text/plain' });
    if ( err.name ) {
        res.write(`${err.name}\n`);
    }
    if ( err.message ) {
        res.write(`${err.message}\n`);
    }
    if ( err.stack ) {
        res.write(`${err.stack}\n`);
    }
    res.end();
    return status;
}

async function exists(path) {
    try {
        await fs.promises.access(path);
        return true;
    } catch {
        return false;
    }
}
