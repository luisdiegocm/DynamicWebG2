//Node modules for HTTP and FileSystem
var http = require('http');
var fs = require('fs');
var mailer = require("../helpers/mailer.js")

//Config Archive
var config = require('../config');
console.log("About: author ",config.author," version ",config.version);

//Modules (written by Johannes Feiner)
var up = require('../helpers/urlparser');
var routes = require('./routes');
var sessMgmt = require('../model/session_mgmt');

//Set the PORT if receive as an argument
config.port = process.argv[2] || 8888;

startup = function(){
    //Start up the server
	http.createServer(function (req, res) {
		req.url = routes.checkForUrlRedirection(req);
        
        //Evaluates the method the request is using
	    if (req.method == 'POST' || req.method == 'PUT' ) {        
            //Create a body variable to set the parameters
	        var body = '';
            //Wait for Post Data
			req.on('data', function(data) {
				body += data;
			});
	        req.on('end', function () {
 				console.log("POST data: '"+body+"'");
                //Instance of the Dictionary with the URL parts
 				var restUrl= new up.UrlParser(req,body);
 				restRouting(req,res,restUrl);
	        });
			
		}else{
            //Instance of the Dictionary with the URL parts
			var restUrl= new up.UrlParser(req);
            //Resolve the URL
			restRouting(req,res,restUrl)
		}
  	}).listen(config.port, config.server);
	
	console.log('Server running at http://'+config.server+':'+config.port+'/')
};
	
var restRouting = function(req,res,restUrl){

	//Extracts the Cookies from the request, to see if there is already cookies in the Client
	var cookies 	= sessMgmt.extractCookiesFromRequest(req);
    //Look out for the Session_ID of the cookie
	var session_id	= sessMgmt.getSessionId(cookies);
    //Get or create a new session according to the Session_ID
	var session 	= sessMgmt.getOrCreateSession(session_id,restUrl.params);
    //Update the res header with the Cookie
	sessMgmt.updateTheResponseHeaders(cookies,session,res);
    //Show all the Sessions in the server
    sessMgmt.showSessions();

    restUrl.req = req;
	//Get current User from the Session
	var user = session.user;
    
    if (user === null){
        console.log("There is no User logged in");
    }
    else{
        console.log("User "+user+" logged in");
    }
  
    //Route the URL 
    //console.log("Routing: we analyse url and return 'something' for restUrl: ", restUrl);
    //Switch between the possible controllers
    switch(routes.getController(restUrl)){
    case 'static': 
          console.log("Static Files returned");
          var staticFileController = require('./static_controller');
          staticFileController.handle(restUrl,res);
          break;
	case 'journey':
  		var journeyController = require('./journey_controller');
		journeyController.handle(restUrl,res);
            
		break;
	case 'page':
  		var pageController = require('./page_controller');
		pageController.handle(restUrl,res);
		break;
	case 'login':
  		var pageController = require('./login_controller');
		pageController.handle(restUrl,res,req);
		break;
    /*
	case 'testing':
		var testingController = require('./testing_controller')
		testingController.handle(restUrl,res,config)
		break;*/
	default:
		// unknown filename/path/id/format:
		res.writeHead(400, {'Content-Type': 'text/plain'});
		res.end('Not a correct route: "'+restUrl.filename+'" with path="'+restUrl.path+'", id="'+restUrl.id+'" and type="'+restUrl.format+'" !\n');
  }
};

module.exports.startup=startup;
