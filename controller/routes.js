module.exports = {
	
	//Redirect if receive a / or "" to the index.html
	checkForUrlRedirection: function(req){
	  // console.log("request-url: '"+req.url+"'");
	  var curr_url = req.url
  	  if (curr_url == "/" || curr_url == "" ){
		  console.log("Redirect '/' to our welcome page 'index.html'... ")
  		  curr_url="/index.html"
  	  }
	  return curr_url
	},
	
	//Return a controller based on the path/resource/filename/authentication/cookie/...
	getController: function(restUrl){
		console.log("DEBUG routes: restUrl.filename='"+restUrl.filename+"'... ")
		var controllerString = "default"
			
		if (restUrl.path.indexOf("public") >=0 ) controllerString = 'static'
		if (restUrl.resource == "public") 		 controllerString = 'static'
		if (restUrl.filename == "index.html" )   controllerString = 'page'
			
		if (restUrl.resource == "journey") 		 controllerString = 'journey'
        
        if (restUrl.resource == "edit") 		 controllerString = 'journey'
			
		if (restUrl.resource == "page") 		 controllerString = 'page'
			
		//if (restUrl.resource == "testing") 		 controllerString = 'testing'
			 
		return controllerString
	}
	
}