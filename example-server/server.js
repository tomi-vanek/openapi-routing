import * as http from "http";
import { URL } from 'url';
import { routerForSchema, readSchema } from "../index.js";

const __dirname = new URL('.', import.meta.url).pathname + '';

const port = process.env.PORT || 3333;
const hostname = process.env.HOST || '127.0.0.1';
const schemaFileName = process.env.SCHEMA || __dirname + 'simple-api.yaml';

console.log(`Starting API defined by schema
    ${schemaFileName}`);

const schema = await readSchema(schemaFileName);

const endpoints = Object.keys(schema.paths).map(x => `  - ${hostname}:${port}${x}
${Object.keys(schema.paths[x]).map(m => `      --> ${m}${schema.paths[x][m]['description'] ? ': ' + schema.paths[x][m]['description'] : ''}`).join('\n')}`).join('\n\n');
console.log(`
Endpoints of ${schema.info.title} microservice:
${endpoints}`);

console.log(endpoints);

const apiRouter = await routerForSchema(schema, __dirname, __dirname + 'handlers');

http
    .createServer(apiRouter)
    .listen(port, hostname, splashScreen);

function splashScreen() {
    const msg = `${new Date().toISOString()} - ${schema.info.title} ${schema.info.version} is listening on ${hostname}:${port}`;
    const line = '~'.repeat(msg.length + 2);
    console.log(`
   ,-${line}-.
  (   ${msg}   )
   \`-${line}-'
`);
}
