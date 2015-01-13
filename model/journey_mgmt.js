"use strict"
//FileSystem module
var fs = require('fs')
//Model module
var Journey = require("../model/journey_model")

// npm install redis
var redis = require("redis")

//Initialize class
var JourneyData = function(){
	
    console.log("DEBUG JourneyData initialisation. We setup the db-connection.")
	this.db = redis.createClient(6379,"127.0.0.1")
    
}

JourneyData.prototype.addJourney = function(theView,res,restUrl){
    theView.render(res,restUrl,journeys)
}

//Create a new Journey
JourneyData.prototype.create = function(theView,res,restUrl){
	var returnErr = this.returnErr
		
	//Prepare the call-back-function
	var gotDataCallbackFunction = function(err, journeys){
		if (err === null ){
			theView.render(res,restUrl,journeys)
		}else
			returnErr(res,"Error with database: "+err);
	}	

	console.log("DEBUG Journey store journey by id '"+restUrl.id+"'...")
	var returnErr = this.returnErr
    
	var name=restUrl.params['name'] || "post/get param name unknown"
	var start=restUrl.params['start'] || "post/get param start unknonw"
	var end=restUrl.params['end'] || "post/get param end unknonw"
	var country=restUrl.params['country'] || "post/get param country unknonw"
	var summary=restUrl.params['summary'] || "post/get param summary unknonw"
    var image=restUrl.params['image'] || "post/get param image unknonw"

    var db = this.db
	db.incr("SEQUENCE_ID",function(err,data){ //Unique ID
	  var idNext=data
	  console.log("for increase SEQUENCE_ID we got: ",idNext)
      var journey = new Journey(idNext,name,start,end,country,summary,image);
	  console.log("DEBUG JourneyData create a new journey with name='"+name+": ",journey)
	  db.hset("journey",journey.id,JSON.stringify(journey), function(err, data){ // async read data (from db)
		if (err === null ){
			db.hgetall('journey',function(err,data){
				console.log("DEBUG: all journeys as raw data:",data)
				var journeys=[]
				for (var i in data){
					//console.log("DEBUG: a journey:",i, data[i] )
					journeys.push( JSON.parse( data[i] ) )	
				}
				//console.log("DEBUG: all journeys:",journeys)
				gotDataCallbackFunction( err, journeys )
			});
		}else{
			console.log("ERROR: creating new journey")
			returnErr(res,"Error creating new journey: "+err);
		}
	  });
    })
}

//
// find all the songs (optional: fulfilling a given filter-criterium)
// 
JourneyData.prototype.findAll = function(theView,res,restUrl, filter){
	console.log("DEBUG Journey find all journeys...")
	var returnErr = this.returnErr
		
	// prepare the call-back-function
	var gotDataCallbackFunction = function(err, journeys){
		if (err === null ){ // not: ...=== undefined
			theView.render(res,restUrl, journeys )
		}else
			returnErr(res,"Error reading file: "+err);
	}	
    
    this.db.hgetall('journey',function(err,data){
		console.log("DEBUG: all journeys as raw data:",data)
		//console.log("DEBUG: songs['2']:",JSON.parse(data['2']).title )
		var journeys=[]
		for (var i in data){
			//console.log("DEBUG: a journey:",i, data[i] )
			var newJourney=JSON.parse( data[i] )

			newJourney.__proto__ = Journey.prototype; 
			if ( newJourney.fulfillsSearchCriteria(filter) ){
				journeys.push( newJourney )					
			} 
		}
		//console.log("DEBUG: all journeys:",journeys)
		gotDataCallbackFunction( err, journeys )
	});

}

JourneyData.prototype.deleteById = function(theView,res,restUrl){
	console.log("DEBUG Journey delete journey by id '"+restUrl.id+"'...")
	var returnErr = this.returnErr
	this.db.hdel("journey",restUrl.id,function(err, data){ // async read data (from db)
		if (err === null ){
			console.log(" DEL: we got from the database raw data '"+data+"'");
			if (data>0) // hdel: 0 for error, 1 for success
				theView.render(res,restUrl,{status:'SUCCESS',message:"we deleted Journey with id "+restUrl.id}) // call view with the data-item
			else
				returnErr(res,"Delete-Error: Journey with id '"+restUrl.id+"' not found.")
		}else
			returnErr(res,"Error reading database: "+err);
	}); 
}


//
// find a song by it's id
// 
JourneyData.prototype.findById = function(theView,res,restUrl){
	console.log("DEBUG Journey find journey by id '"+restUrl.id+"'...")
	var returnErr = this.returnErr
	this.db.hget("journey",restUrl.id,function(err, data){ // async read data (from db)
		if (err === null ){
			console.log(" we got for Journey id='"+restUrl.id+"' raw db data '"+data+"'");
			if (data){
				var journey= JSON.parse( data.toString('UTF-8') )
				console.log(" => Journey with id "+restUrl.id+":",journey);
				theView.render(res,restUrl,journey) // call view with the data-item				
			}else{
				returnErr(res,"Journey with id '"+restUrl.id+"' not found.")				
			}
		}else
			returnErr(res,"Error reading database: "+err);
	}); 
}

JourneyData.prototype.findJourneyById = function(id){
    console.log(id);
	var returnErr = this.returnErr
	this.db.hget("journey",id,function(err, data){ // async read data (from db)
		if (err === null ){
			if (data){
                console.log(data.toString('UTF-8'));
				var journey= JSON.parse( data.toString('UTF-8') )
				return journey;			
			}else{
				returnErr(res,"Journey with id '"+id+"' not found.")				
			}
		}else
			returnErr(res,"Error reading database: "+err);
	}); 
}



// curl -X PUT "http://localhost:8888/testing/song/2.json?title=Another%20bites&artist=queen"
//
// update (=replace) a song with a given id
//
JourneyData.prototype.persistById = function(theView,res,restUrl,journey){
    console.log("DEBUG JourneyDate store/persist journeys by id '"+restUrl.id+"'...")
    var returnErr = this.returnErr
	this.db.hset("journey",restUrl.id,JSON.stringify(journey), function(err, data){ // async read data (from db)
		if (err === null ){
			console.log(" we saved the Journey to the database.");
			theView.render(res,restUrl,journey) // call view with the data-item
		}else
			returnErr(res,"Error reading database: "+err);
	}); 
}


// helper:
JourneyData.prototype.returnErr = function(res,msg){
  	res.writeHead(503, {'Content-Type': 'text/plain'});
  	res.end("ERROR: '"+msg+"'\n");	
}
module.exports = JourneyData