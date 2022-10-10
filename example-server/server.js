import * as http from 'http';
import url from 'url';
import path from 'path';
import { routerForSchema, readSchema, endpointsMessage } from '../index.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const port = process.env.PORT || 8080;
const hostname = process.env.HOST || 'localhost';
const schemaFileName = process.env.SCHEMA || path.join(__dirname, '/simple-api.yaml');

console.log(`Starting API defined by schema
    ${schemaFileName}
`);

const schema = await readSchema(schemaFileName);

console.log( endpointsMessage(schema) );

const rootDir = __dirname;
const handlerDir = path.join(__dirname, '/handlers');
const apiRouter = await routerForSchema(schema, rootDir, handlerDir);

http
    .createServer(apiRouter)
    .listen(port, hostname, startMessage);

function startMessage() {
    const msg = `${new Date().toISOString()} -- ${schema.info.title} ${schema.info.version} -- ${hostname}:${port}`;
    const line = '~'.repeat(msg.length + 2);
    console.log(`
   ,-${line}-.
  (   ${msg}   )
   \`-${line}-'
`);
}
