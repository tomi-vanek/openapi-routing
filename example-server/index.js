import * as http from "http";
import { URL } from 'url';
import { routerForSchema, readSchema } from "../index.js";

const __dirname = new URL('.', import.meta.url).pathname;

const port = process.env.PORT || 3333;
const schemaFileName = process.env.SCHEMA || __dirname + 'simple-api.yaml';

const title = `Starting with schema ${schemaFileName} ...`;
console.log(`
${new Date().toISOString()}
${title}

`);

const schema = await readSchema(schemaFileName);
const apiRouter = await routerForSchema( schema, __dirname + 'handlers' );

http
  .createServer( apiRouter )
  .listen( port );

StartMsg();

function StartMsg() {
  const msg = `${schema.info.title} version ${schema.info.version} is listening on port ${port}`;
  const line = '~'.repeat(msg.length + 2);
  console.log(`
    ,-${line}-.
   (   ${msg}   )
    \`-${line}-'
`);
}
