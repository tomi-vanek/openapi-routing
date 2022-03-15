# Lightweight routing specified by Open API 3

Minimalistic solution to create a microservice from an OpenAPI schema.

## Quick start

1. Clone `openapi-routing` to your local machine with command `git clone https://github.com/tomi-vanek/openapi-routing.git`
1. Load dependencies with command `npm install`
1. Run example server with `node ./example-server/index.js`
1. Test in browser with URL `http://localhost:3333/v1/artists/foo-bar?x=123&aaa=qwerty`

## Create your own microservice

1. Create a directory for your new REST microservice and go to that directory
1. Initialize the microservice project with `npm init`. Project configuration file `package.json` is created.
1. Add to the `package.json` configuration file following line to switch module loading to standard EcmaScript module system: `"type": "module",`
1. Install and load the `openapi-routing` library with command `npm i openapi-routing`
1. Create a new schema for the new REST microservice (for exploration purposes you may copy the `example-server/simple-api.yaml` schema)
1. Create directory for request handlers - i.e. `handlers` and the handler modules (for exploration you may copy the directory `example-server/handlers` into your project)
1. Create API server start module `index.js` (for exploration you may take the file `example-server/index.js`)

## How it works

Library `openapi-routing` reads the Open API 3 schema either in YAML or in JSON format. From the schema are configured routing rules that determine the EcmaScript module that contains the request handler. Library can be used in plain Node.js http / https createServer - no need to include additional framework (express) to run a lightweight API server.

Handler modules are by convention in directory `handlers`. Each handler module path and name is identical with the  http / httpspath in OpenApi schema that receives `.js` extension.

Example:

- The path `/artists` has handler module `/handlers/articles.js`.
- The path `/artists/{username}` has handler module `/handlers/artists/{username}.js` (curly brackets are valid characters in file name ;-) ).

## Handlers

Handler module is a regular ES6 module that exports handler function for each method, that is defined in schema (i.e. GET, POST, PUT). Name of the function is by convention `handle<METHOD>` - i.e. `handleGet(parameters)`, `handlePost(parameters, data)`. Router reads parameters from URL path and query and merges them to parameters object. If the request provides also data in body in JSON format, router reads the data, concatenates them if the data are comming fro multiple requests, and provides these data by calling the handler function.

Handler function is defined as `async`, so the eventual long running input / output will not block the server. Handler function returns data that will be sent to client either directly in text format or serialized to JSON format.

Example of a handler:

``` JavaScript
export async function handleGet(params) {
  // parameter handling, create response data
  // ... in this case for test we return params without any change
  return params;
}

export async function handlePost(params, data) {
  // parameter handling, create response data
  // ... in this case for test we return input data without any change
  return data;
}
```

## Meta endpoints

Router offers endpoints that provide "technical" meta information about the API:

- `/meta/schema.yaml` - provides schema in YAML format
- `/meta/schema.json` - provides schema in JSON format
- `/meta/info` - basic information about the service - extracted from the schema
- `/meta/health` - health check for simpler deployment to cloud environment
