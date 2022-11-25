# Release history

## ver 0.4.26 HTTP response code by error

* Default HTTP response code by an exception thrown by handler is 500 = internal server error. If the handler wants to decide about returned status code - i.e. 404 (Not found) or 400 (Bad input) - the thrown error code must contain integer value in property `status`.

## ver 0.4.23 liberal CORS http header

* Removed restriction for directories that provide static files

## ver 0.4.20 liberal CORS http header

* Fixed file paths for Windows

## ver 0.4.19

* Fixed file paths for Windows

## ver 0.4.15

* Data in POST handlar parameter are raw Buffer. For JSON data they must be parsed to JavaScript object: JSON.parse( data.toString() )

## ver 0.4.14

* Path params may contain also dot(s) 

## ver 0.4.12

* Fixed crashing if response was not returned. 

## ver 0.4.11

* Body in input form without JSON parse - the handler will process the body data accordingly.
* Added contentType parameter to post / put handler.
* Default host changed to "localhost" - better for Docker deployments.

## ver 0.4.9

* Execution time in logs

## ver 0.4.9

* Logs requests and response code
* README document refinement

## ver 0.4.6

* Support for file download

## ver 0.4.4

* Refactoring, bug fixing

## ver 0.4.2

* Extended set of supported mime types for static files

## ver 0.4.0

* Swagger UI

## ver 0.3.0

* Response in any format (initial implementation supported only JSON responses)
* Updated README documentation

## ver 0.1.0

* Initial implementation of the routing with ES6 modules as custom handler functions
