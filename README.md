# Schema-first microservice with OpenAPI 3

The __openapi-routing__ library is a minimalistic solution to create a microservice from an OpenAPI schema.

OpenAPI schema is treated as ultimate __single source of truth__ by describing and declaring interface / contract of our microservice. From this contract are derived all the routing rules that call appropriate handling functions - the behavior/functionality of the microservice.

The `openapi-routing` library serves as a lightweight routing specified by Open API 3 in _Node.js_. This library does not need Express or any other framework, it uses just standard vanila JavaScript, and _Node.js_. But of course it coexists seamlesly with any framework, if the microservice uses framework's functionality.

A microservice with `openapi-routing` is made in 2 steps:

1. Designing OpenAPI schema for the API / microservice interface
1. Writing handler modules and functions declared in the schema

## Quick impression

To have an idea what the library does and how is the application logic for API server implemented, you may clone the project and use an example server that shows an API built form OpenAPI schema.

1. Clone `openapi-routing` to your local machine with command 
    ``` Shell
    git clone https://github.com/tomi-vanek/openapi-routing.git
    ```
1. Load dependencies with command
    ``` Shell
    npm install
    ```
1. Run the example server with command
    ``` Shell
    npm start
    ```
1. Test in browser with following URLs:
    ``` INI
    http://127.0.0.1:3333/v1/artists/Wolfgang%20von%20Kempelen
    ```
    ``` INI
    http://127.0.0.1:3333/v1/artists?limit=321&offset=32
    ```
    ``` INI
    http://127.0.0.1:3333/v1/stats
    ```
    ``` INI
    http://127.0.0.1:3333/meta/health
    ```
  
## Create your own microservice from OpenAPI schema

1. Create a new schema for the new REST API / microservice (for exploration purposes you may copy the `example-server/simple-api.yaml` schema)
1. Create a directory for your new REST microservice and go to that directory
1. Initialize the microservice project and create the project configuration file `package.json` with command:
    ``` Shell
    npm init
    ```
1. Add to the `package.json` configuration file following line to switch module loading to standard EcmaScript module system: `"type": "module",`
1. Install and load the `openapi-routing` library with command 
    ``` Shell
    npm install openapi-routing
    ```
1. Create a directory for request handlers (by default I use `handlers` name) and handler modules. If you want just try out the library, you can copy the directory `example-server/handlers` into your project.
1. Create API server start module `server.js`. If you want just try out the library, you may take the file `example-server/server.js`.

## How it works

The `openapi-routing` library can be used in plain _Node.js_ http / https createServer - no need to include additional framework (i.e. Express) to run a lightweight API server.

### Server start

1. By server start the `openapi-routing` reads Open API 3 schema for the REST service, either in YAML or in JSON format.
1. The `openapi-routing` identifies the paths from schema, and for each path the methods served in that path.
1. For each path and method is created a routing rule. Path is mapped to a JavaScript path and file in `<project-root-dir>/handlers` directory. Each HTTP method for the path in schema has a handler function exported in the ES6 handler module.

### HTTP request handling

1. By each HTTP request from a client, the `openapi-routing` finds the routing rule for incoming URL path and HTTP method.
1. The `openapi-routing` reads From the routing rule the file path to the handler module, and the name of the handler function in the module.
1. The `openapi-routing` opens the handler module, and calls asynchronously the handler function with incomming parameters and if appropriate, also with data from request body (i.e. by POST request). After the handler function finishes the processing, the return value is sent as HTTP response to the calling client.

## Handlers - application logic

Application logic is organized into __handler modules__ and implemented in __handler functions__.

Handler modules export handler functions that are called by routing logic to process API requests.

Handler modules are by convention in directory `<project-root-dir>/handlers`. Each handler module path and name is identical with the _http_ or _https_ path in OpenApi schema that receives `.js` extension.

Example:

- The path `/artists` has handler module `<project-root-dir>/handlers/artists.js`.
- The path `/artists/{username}` has handler module `<project-root-dir>/handlers/artists/{username}.js` ... curly brackets are valid characters in file name ;-).

Each handler module serves specific path defined in the OpenAPI schema. Handler module is a regular ES6 module (defined in JavaScript standards and supported in current _Node.js_). For each HTTP method specified in the OpenAPI schema, the handler module exports a handler function. Name of the handler function is by convention `handle<METHOD>` - i.e. `handleGet(parameters)`, `handlePost(parameters, data)`. HTTP methods are GET, POST, PUT, PATCH, DELETE, HEAD, etc.

Router reads parameters from URL path and from query. Parameters are merged to _parameters object_. If the request provides also data in body (in JSON format), the router reads incomming data, concatenates them (supporting multipart - data in more calls from client), and provides these parameters and data to _handler function_.

Handler function is defined as `async`, so if processing is long, it does not block the server by executing handlers for concurrent requests in parallel. Handler function returns data that will be sent to client either directly in text format or and object that is going to be serialized to JSON format, or data in binary format together with the mime format definition.

Binary return value is an object with 2 fields:
* mime --> MIME type (IANA media type), i.e. "image/png"
* data --> buffer or stream with binary data

Example of a handler with simple return value (string object):

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

Example of a handler with binary return value (string object):

``` JavaScript
import {promises as fsPromises} from 'fs';

const fileName = new URL('.', import.meta.url).pathname
    + '../assets/pie-chart.jpg';

export async function handleGet() {
    return {
        mime: 'image/jpg',
        data: fsPromises.readFile(fileName),
    };
}
```

## Meta endpoints

Router offers endpoints that provide "technical" meta information about the API that are not declared in the schema:

- `/meta/schema.yaml` - provides schema in YAML format
- `/meta/schema.json` - provides schema in JSON format
- `/meta/health` - health check for simpler deployment to cloud environment
- `/meta/info` - basic information about the service - extracted from the OpenAPI schema
- `/meta/routing` - routing rules used for request handling

## User interface

Very useful fearure for a microservice is web user interface generated form the OpenAPI schema. User interface can serve as human-readable documentation, as experimenting tool for developers or as a tool for testers.

Adding UI to your microservice is simple:
1. Create directory with name `ui` in root of the microservice
1. Download the newest release of Swagger UI from page https://github.com/swagger-api/swagger-ui/releases
1. Unzip the code, and copy hte content of the directory `release` into the directory `ui` in your project
1. Edit the file `/ui/index.html`:
  - Change the schema URL to `"/meta/schema.yaml"`:

    ``` JavaScript
    const ui = SwaggerUIBundle({
      url: "/meta/schema.yaml",
    ```

  - Optional: change the configuration of the UI application. I usually add following lines to the SwaggerUIBundle configuration object:

    ``` JavaScript
    const ui = SwaggerUIBundle({

        ...

        // custom configuration:
        tryItOutEnabled: true,
        jsonEditor: true,
        showRequestHeaders: true,
        defaultModelExpandDepth: 5,
        defaultModelsExpandDepth: 5,
        defaultModelRendering: "model",
        displayRequestDuration: true,
        docExpansion: "list",
    };
    ```

  - Optional: change the look & feel of the application - select a theme from https://ostranme.github.io/swagger-ui-themes/
  - Optional: change the logo, favicon, title in HTML, change fonts and colors with CSS, ... (the visual aesthetic is very important)

## Roadmap

Ideas for enhancements in future releases of `openapi-routing`:

* Configuration
* Compatibility with Express framework
* Plugable architecture for simple integration and for extensions --> processing cascade
* Headers for secure responses
* Support for compressed responses
* Code generator for initial structure of handlers and Dockerfile for simple deployment

## Credits

* YAML reading and transformation to/from JSON: https://eemeli.org/yaml/
* Image in example was created from https://commons.wikimedia.org/wiki/File:Mammal_species_pie_chart.svg
