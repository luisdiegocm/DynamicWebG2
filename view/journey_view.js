"use strict"
var fs = require('fs')
	
var JourneyView = function(){
	console.log("DEBUG Journey initialise...")
	this.layout="view/layout.html"
	this.journey_template	="view/journey/journey_template.html"
	this.journeys_template	="view/journey/journeys_template.html"
	this.search_template="view/journey/search_template.html"
}


JourneyView.prototype.formatHtml = function(res,restUrl,data,htmlTemplate){
	var result = htmlTemplate
		
	if (restUrl.id=="all"){ // a list of songs
		// TODO smarter replacement
		var journeyHTML=""
		for (var journey in data){
            console.log(journey);
			var curr_journey=data[journey]
			journeyHTML+= "<li>"
			journeyHTML+= "<a href=\""+curr_journey.id+".html\">"
			journeyHTML+= curr_journey.name
			journeyHTML+= "</a>"
			journeyHTML+= "</li>"
		}
		result=result.replace(/{JOURNEYS}/g,journeyHTML ) 
			
	}else{ // a single song:
		// TODO smarter replacement
		if (data && data.title)
			result=result.replace(/{NAME}/g,data.name ) 
						 .replace(/{START}/g,data.start ) 
						 .replace(/{SONGID}/g,data.id)
						 .replace(/{COUNTER}/g,7 ) // TODO add more data :)		
		
	}
			
	// send html data back to client	
	res.writeHead(200, {'Content-Type': 'text/html'} );
	res.end(result);	
	
}

JourneyView.prototype.getDetailTemplate = function(journeyView, res,restUrl,data,layoutHtml){
    //Grab the format of the query
	var format = restUrl.format
    //If you are searching
	if (restUrl.id=="search"){
		var filenameDetailTemplate = this.search_template	
    //If you want to see all Journeys
	}else if (restUrl.id=="all"){
		var filenameDetailTemplate = this.journeys_template			
	}else{
		var filenameDetailTemplate = this.journey_template		
	}
	console.log("Template for Details: '"+filenameDetailTemplate+"'");
	// put it into the layout
	fs.readFile(filenameDetailTemplate,function(err, layoutdata){ 
		if (err === null ){
			var templateDetail= layoutdata.toString('UTF-8')
			var htmlTemplate = layoutHtml.replace("{CONTENTS}",templateDetail)
			journeyView.formatHtml(res,restUrl,data,htmlTemplate);
		}else
			returnErr(res,"Error reading detail-template file '"+filenameDetailTemplate+"' for songs: "+err);
	});
}
	
JourneyView.prototype.getOverallLayout = function(journeyView, res,restUrl,data){
	var filenameLayout=this.layout	
	console.log("DEBUG Journey render in format HTML with template '"+filenameLayout+"'")
	var returnErr = this.returnErr
	fs.readFile(filenameLayout,function(err, filedata){ // async read data (from fs/db)
		if (err === null ){
			var layoutHtml= filedata.toString('UTF-8')
			console.log("DEBUG SongView HTML Layout '"+layoutHtml+"'")
			journeyView.getDetailTemplate(journeyView,res,restUrl,data,layoutHtml)
		}else
			returnErr(res,"Error reading global layout-template file '"+filenameLayout+"'. Error "+err);
	})
}
JourneyView.prototype.render = function(res,restUrl ,data){
	var format = restUrl.format
	console.log("DEBUG Journey render in format: ",format)
	
	var journeyView = this // we save the reference/pointer to this object
		
	if (format=="json"){ // content type for JSON
		console.log("DEBUG: NEED TO IMPROVE FROM DATA "+data)
		res.writeHead(200, {'Content-Type': 'application/json'} );
		// format out data <= here into JSON
		var result = JSON.stringify(data) // fill template
		result +="\n"
		res.end(result); // return formatted data to the client

	}else if (format=="html"){	
		// now we render one journey, many journeys or the journey-search form
		if (data) 	
			this.getOverallLayout(journeyView, res,restUrl,data)
		else
			this.getOverallLayout(journeyView, res,restUrl,data)
	}else{
		this.returnErr(res,"Error: The specified format '"+format+"' is unknown!")
	}
}


// Some helpers:

// JSON render Not-Implemented Error on data-loading
JourneyView.prototype.renderNotImplemented = function(res,restUrl,data){
	console.log("DEBUG Journey render not implemented yet.")
	res.writeHead(400, {'Content-Type': 'application/json'} );
	res.end( JSON.stringify(data)+"\n" );
}	

// JSON render Error on data-loading
JourneyView.prototype.renderError = function(res,restUrl,data){
	console.log("DEBUG Journey render not implemented yet.")
	res.writeHead(404, {'Content-Type': 'application/json'} );
	res.end(  JSON.stringify(data)+"\n" );
}
module.exports = JourneyView


// helper Errors for this view:
JourneyView.prototype.returnErr = function(res,msg){
	console.log("DEBUG Journey: "+msg)
  	res.writeHead(503, {'Content-Type': 'text/plain'});
  	res.end("ERROR: '"+msg+"'\n");	
}

