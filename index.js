//Dependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

//Server should respond to all requests with a string

var server = http.createServer((req, res) => {
    //Get the url and parse it
    var parsedUrl = url.parse(req.url, true);

    //Get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    //Get the query strings as an object
    var queryStringObject = parsedUrl.query;

    //Get the HTTP method
    var method = req.method.toLowerCase();

    //Get headers as an object

    var headers = req.headers;

    //Get the payload if any

    var decoder = new StringDecoder('utf-8');
    var buffer = '';

    req.on('data', (data) => {
        buffer += decoder.write(data);
    });

    req.on('end', () => {
        buffer += decoder.end();
        
        var chosenHandler = router[trimmedPath] ? router[trimmedPath]: handlers.notFound;

        var data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer
        };

        chosenHandler(data, (statuscode, payload) => {

            statuscode = typeof statuscode === 'number' ? statuscode : 200; //use the status code called back or sending default as 200
            
            payload = typeof payload === 'object' ? payload : {}; //use the payload called back or sending default as empty object

            payloadString = JSON.stringify(payload);

            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statuscode);

            res.end(payloadString); //Send a response

        })
    })   
});

//Start the server, have it listen to port 3000
server.listen(3000, () => {
    console.log('server has started listening on port 3000');
})

//Define a request router
var handlers = {
    hello(data, callback){
        
        callback(200, {'message': "Hello, it's Praneet here. Nice to meet you :-)"}); //Callback a status code and payload
    },
    notFound(data, callback){
        
        callback(404); //Respond with 404 for route notfound
    }
};

var router = {
    'hello': handlers.hello
};