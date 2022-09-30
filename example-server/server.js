import * as http from 'http';
import { URL } from 'url';
import { routerForSchema, readSchema, endpointsMessage } from '../index.js';

const __dirname = new URL('.', import.meta.url).pathname + '';

const port = process.env.PORT || 8080;
const hostname = process.env.HOST || 'localhost';
const schemaFileName = process.env.SCHEMA || __dirname + 'simple-api.yaml';

console.log(`Starting API defined by schema
    ${schemaFileName}
`);

const schema = await readSchema(schemaFileName);

console.log( endpointsMessage(schema) );

const apiRouter = await routerForSchema(schema, __dirname, __dirname + 'handlers');

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
