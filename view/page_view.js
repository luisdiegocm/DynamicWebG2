//Modules
fs=require("fs");

//Initialize the object
var PageView = function(){
	console.log("The Page_View has been initialized");
    //Create the variables of all the HTML layouts and pages
	this.layout="view/layout.html";
	this.welcome_template	="view/page/welcome_template.html";
	this.about_template		="view/page/about_template.html";
	this.login_template 	="view/login/login_template.html";
	this.signup_template 	="view/login/signup_template.html";
	this.notfound_template	="view/page/notfound_template.html";
};

PageView.prototype.formatHtml = function(res,restUrl,data,htmlTemplate){
    //The var with the template and the content
	var result = htmlTemplate
		
	// TODO smarter replacement
	if (data && data.title)
			result=result.replace(/{TITLE}/g,data.title ) 
						 .replace(/{ARTIST}/g,data.artist ) 
						 .replace(/{COUNTER}/g,7 ) // TODO add more data :)		
		
	// send html data back to client	
	res.writeHead(200, {'Content-Type': 'text/html'} );
	res.end(result);	
	
};

PageView.prototype.getDetailTemplate = function(pageView, res,restUrl,data,layoutHtml){
    //Retrieve the format of the replaced layout.
	var format = restUrl.format;
    //Switch the id of the URL to see which page is
	if (restUrl.id=="index"){
		var filenameDetailTemplate = this.welcome_template	
	}else if (restUrl.id=="about"){
		var filenameDetailTemplate = this.about_template
	}else if (restUrl.id=="login"){
		var filenameDetailTemplate = this.login_template			
	}else if (restUrl.id=="signup"){
		var filenameDetailTemplate = this.signup_template
	}else{
		var filenameDetailTemplate = this.notfound_template		
	};
    
	console.log("Template for Details: '"+filenameDetailTemplate+"'");
	// put it into the layout
	fs.readFile(filenameDetailTemplate,function(err, layoutdata){ 
		if (err === null ){
            //Create a String of the URL
			var templateDetail= layoutdata.toString('UTF-8');
            //Replace the {CONTENTS} space with the String URL
			htmlTemplate = layoutHtml.replace("{CONTENTS}",templateDetail);
			pageView.formatHtml(res,restUrl,data,htmlTemplate);
		}else
			returnErr(res,"Error reading detail-template file '"+filenameDetailTemplate+"' for songs: "+err);
	});
};
	
//Call from .render(), it is in charge of getting the LAYOUT HTML to then use it
PageView.prototype.getOverallLayout = function(pageView, res,restUrl,data){
    //Create the variable for the layout of the pageView
	var filenameLayout=this.layout;
	console.log("Template '"+filenameLayout+"'");
	var returnErr = this.returnErr;
    //Read the layout to retrieve it
	fs.readFile(filenameLayout,function(err, filedata){ // async read data (from fs/db)
		if (err === null ){
            //Create a string with the HTML of the Layout
			var layoutHtml= filedata.toString('UTF-8');
			console.log("DEBUG PageView HTML Layout '"+layoutHtml+"'");
			pageView.getDetailTemplate(pageView,res,restUrl,data,layoutHtml);
		}else
			returnErr(res,"Error reading global layout-template file '"+filenameLayout+"'. Error "+err);
	});
};

//Call from Page_Controller
PageView.prototype.render = function(res,restUrl ,data){
	var pageView = this; // we save the reference/pointer to this object
	this.getOverallLayout(pageView, res,restUrl);
};


// Some helpers:

// JSON render Not-Implemented Error on data-loading
PageView.prototype.renderNotImplemented = function(res,restUrl,data){
	console.log("DEBUG PageView render not implemented yet.");
	res.writeHead(400, {'Content-Type': 'application/json'} );
	res.end( JSON.stringify(data)+"\n" );
};

// JSON render Error on data-loading
PageView.prototype.renderError = function(res,restUrl,data){
	console.log("DEBUG PageView render not implemented yet.");
	res.writeHead(404, {'Content-Type': 'application/json'} );
	res.end(  JSON.stringify(data)+"\n" );
};
module.exports = PageView;


// helper Errors for this view:
PageView.prototype.returnErr = function(res,msg){
	console.log("DEBUG PageView: "+msg);
  	res.writeHead(503, {'Content-Type': 'text/plain'});
  	res.end("ERROR: '"+msg+"'\n");	
};

