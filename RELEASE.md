# Release history

## ver 0.4.18

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
