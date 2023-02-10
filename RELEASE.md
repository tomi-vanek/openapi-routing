# Release history

## ver 0.5.4 Start log with path summary

* When a path has a summary, the log message will use this text instead of typically longer description

## ver 0.5.0 Version used in production

* This version is used in production project. The changes of version 0.4.x were made according feedback from application development.

## ver 0.4.32 Introduced standard styleguide

* Introduced standard styleguide and tool for code validation.

## ver 0.4.31 Fixed problems with URL decoding

* If a parameter is a malformed URI fragment or was already decoded upstream, it is provided to handler as is, without decoding.

## ver 0.4.27 fixed routing

* If routing paths shared first part of name in the last segment of path, wrong path was selected.

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
