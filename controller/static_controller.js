"use strict"

//Modules
var fs = require('fs')

//Initialize the class
var StaticFilesController = function(){
	console.log("DEBUG StaticFilesController initialisation...")
}

//Function that handles the URL that receive
StaticFilesController.prototype.handle = function(restUrl,res){
    //Get the filename that receives from the URL
	var filename = restUrl.filename
    //Checks out if have a resource in the URL path
	if (restUrl.resource.length>0){ 
        filename = restUrl.resource+"/"+filename
    }
	if (restUrl.relPath.length>0){
        filename = restUrl.relPath+"/"+filename
    }
	console.log("Static file '"+restUrl.format+"' file: '"+filename+"'...")
    var returnErr=this.returnErr
	//Reads the file that was received
    fs.readFile(filename,function(err, filedata){ // async read data (from fs/db)
		if (err === null ){
			if (restUrl.format.indexOf('png')>=0 ){
				res.writeHead(200, {'Content-Type': 'image/png'} );
				res.end(filedata);
			}else if (restUrl.format.indexOf('jpg')>=0){
				res.writeHead(200, {'Content-Type': 'image/jpeg'} );
				res.end(filedata);
			}else if ( restUrl.format.indexOf('m4a')>=0 ){
				res.writeHead(200, {'Content-Type': 'audio/m4a'} );
				res.end(filedata);
			}else if (restUrl.format.indexOf('htm')>=0) {
				res.writeHead(200, {'Content-Type': 'text/html'} );
				res.end( filedata.toString('UTF-8') );
			}else if (restUrl.format.indexOf('js')>=0) {
				res.writeHead(200, {'Content-Type': 'text/javascript'} );
				res.end( filedata.toString('UTF-8') );
			}else if (restUrl.format.indexOf('css')>=0) {
				res.writeHead(200, {'Content-Type': 'text/css'} );
				res.end(filedata.toString('UTF-8'));
			}else if (restUrl.format.indexOf('txt')>=0) {
				res.writeHead(200, {'Content-Type': 'text/plain'} );
				res.end(filedata.toString('UTF-8'));
			}else if (restUrl.format.indexOf('ico')>=0) {
				res.writeHead(200, {'Content-Type': 'image/x-icon'} );
				res.end(filedata);
            }else
				returnErr(res,"Unsupported file type: '"+restUrl.format+"'")			
		}else
			returnErr(res,"Error reading file '"+filename+"': "+err);
		}
	)
}
var staticFileController = new StaticFilesController()
module.exports = staticFileController


// helper Errors for static files:
StaticFilesController.prototype.returnErr = function(res,msg){
	console.log("DEBUG: serving static files "+msg)
  	res.writeHead(503, {'Content-Type': 'text/plain'});
  	res.end("ERROR: '"+msg+"'\n");	
}