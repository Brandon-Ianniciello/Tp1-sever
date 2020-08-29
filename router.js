function capitalizeFirstLetter(s){
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1);   
}


////////////////////////////////////////////////////////////
// dispatch_API_EndPoint : an api pipeline
// parse the req.url that must have the following format:
// /api/{ressource name} or
// /api/{ressource name}/{id}
// then select the targeted controller
// using the http verb (req.method) and optionnal id
// call the right controller function
// warning: this function does not handle sub resource and
// and query string of style like 
// api/resource/id/subresource/id?....
///////////////////////////////////////////////////////////
exports.dispatch_API_EndPoint = function(req, res){

    const Reponse = require("./response");
    let response = new Reponse(res);

    // this function extract the JSON data from the body of the request
    // and and pass it to controllerMethod
    // if an error occurs it will send an error response
    function processJSONBody(req, controller, methodName) {
        let body = [];
        req.on('data', chunk =>{
            body.push(chunk);
        }).on('end', ()=>{
            try {
                // we assume that the data is in the JSON format
                if (req.headers['content-type'] === "application/json") {
                    controller[methodName](JSON.parse(body));
                }
                else 
                    response.unsupported();
            } catch(error){
                console.log(error);
                response.unprocessable();
            }
        });
    }

    let controllerName = '';
    let id = undefined;

    // this function check if url contain a valid API endpoint.
    // in the process controllerName and optional id will be extracted
    function API_Endpoint_Ok(url){
        // by convention api endpoint start with /api/...
        if (url.indexOf('/api/') > -1) {
            // extract url componants, array from req.url.split("/") should 
            // look like ['','api','{resource name}','{id}]'
            let urlParts = url.split("/");
            // do we have a resource name
            if (urlParts.length > 2) {
                // by convention controller name -> NameController
                controllerName = capitalizeFirstLetter(urlParts[2]) + 'Controller';
                // do we have an id
                if (urlParts.length > 3){
                    if (urlParts[3] !== '') {
                        id = parseInt(urlParts[3]);
                        if (isNaN(id)) { 
                            response.badRequest();
                            // bad id
                            return false;
                        } else
                        // we have a valid id
                        return true;

                    } else
                     // it is ok to have no id
                     return true;
                }
                else
                    // it is ok to have no id
                    return true;
            }
        }
        // bad API endpoint
        return false;
    }
   
    if (API_Endpoint_Ok(req.url)) {
        // At this point we have a controllerName and an id holding a number or undefined value.
        // in the following, we will call the corresponding method of the controller class accordingly  
        // by using the Http verb of the request.
        // for the POST and PUT verb, will we have to extract the data from the body of the request
        try{
            // dynamically import the targeted controller
            // if the controllerName dos not exist the catch section will called
            const Controller = require('./controllers/' + controllerName);
            // instanciate the controller       
            let controller =  new Controller(req, res);

            if (req.method === 'GET') {
                controller.get(id);
                // request consumed
                return true;
            }
            if (req.method === 'POST'){
                processJSONBody(req, controller,"post");
                // request consumed
                return true;
            }
            if (req.method === 'PUT'){
                processJSONBody(req, controller,"put");
                // request consumed
                return true;
            }
            if (req.method === 'PATCH'){
                processJSONBody(req, controller,"patch");
                // request consumed
                return true;
            }
            if (req.method === 'DELETE') {
                if (!isNaN(id))
                    controller.remove(id);
                else 
                    response.badRequest();
                // request consumed
                return true;
            }
        } catch(error){
            // catch likely called because of missing controller class
            // i.e. require('./' + controllerName) failed
            console.log('endpoint not found');
            response.notFound();
                // request consumed
                return true;
        }
    }
    // not an API endpoint
    // request not consumed
    return false;
}