import express from 'express'
import url from 'url'
import path from 'path'
import { routerForSchema, readSchema, endpointsMessage } from '../index.js'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const port = process.env.PORT || 8080
const hostname = process.env.HOST || 'localhost'
const schemaFileName = process.env.SCHEMA || path.join(__dirname, '/simple-api.yaml')

console.log(`Starting API defined by schema
    ${schemaFileName}
`)

const schema = await readSchema(schemaFileName)

console.log(endpointsMessage(schema))

const rootDir = __dirname
const handlerDir = path.join(__dirname, '/handlers')
const apiRouter = await routerForSchema(schema, rootDir, handlerDir)

const app = express()

app.get('/', (req, res) => {
  console.log('from express handler')
  res.end('Request handled by Express...')
})

app.use(apiRouter)

app.listen(port, hostname, runningMsg)

function runningMsg () {
  const line = '~'.repeat(70)
  console.log(`${line}
   Express app listening on port ${port}
${line}
`)
}
