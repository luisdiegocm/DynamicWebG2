"use strict";
//FileSystem module
var fs = require('fs');
//Model module
var Journey = require("../model/journey_model");

//Redis module
var redis = require("redis");

//Initialize class
var JourneyData = function(){
    //console.log("DEBUG JourneyData initialisation. We setup the db-connection.");
	this.db = redis.createClient(6379,"127.0.0.1");
};

//Show the Journeys from the Search action
JourneyData.prototype.addJourney = function(theView,res,restUrl){
    theView.render(res,restUrl,journeys);
};

//Create a new Journey and make it consistent
JourneyData.prototype.create = function(theView,res,restUrl,user){
	var returnErr = this.returnErr;
		
	//Prepare the call-back-function
	var gotDataCallbackFunction = function(err, journeys){
		if (err === null ){
            //Open the JourneyView object which prepares the HTML to be shown
			theView.render(res,restUrl,journeys);
		}else
			returnErr(res,"Error with database: "+err);
	};

    if (user){
        //console.log("DEBUG Journey store journey by id '"+restUrl.id+"'...");
        var returnErr = this.returnErr;
        //Initialize the parameters received from the URL
        var name=restUrl.params['name'] || "post/get param name unknown";
        var start=restUrl.params['start'] || "post/get param start unknonw";
        var end=restUrl.params['end'] || "post/get param end unknonw";
        var country=restUrl.params['country'] || "post/get param country unknonw";
        var summary=restUrl.params['summary'] || "post/get param summary unknonw";
        var image=restUrl.params['image'] || "post/get param image unknonw";

        //Database variable
        var db = this.db;
        //Async process to get the next unique ID
        db.incr("SEQUENCE_ID",function(err,data){
            //Variable with the ID
            var idNext=data
            //console.log("for increase SEQUENCE_ID we got: ",idNext)
            //Create a Journey object
            var journey = new Journey(idNext,name,start,end,country,summary,image,user);
            //console.log("DEBUG JourneyData create a new journey with name='"+name+": ",journey)
            //Async process to make the Journey consistent in the DB
            db.hset("journey",journey.id,JSON.stringify(journey), function(err, data){
            if (err === null ){
                //Async process that get all the Journeys already consistent in the DB
                db.hgetall('journey',function(err,data){
                    //console.log("DEBUG: all journeys as raw data:",data)
                    //Array variable to push all the Journeys from the DB
                    var journeys=[]
                    //Iteration within the Journeys from the DB
                    for (var i in data){
                        //console.log("DEBUG: a journey:",i, data[i] )
                        //Push the JSON object into the array
                        journeys.push( JSON.parse( data[i] ) )	
                    }
                    //console.log("DEBUG: all journeys:",journeys)
                    //Call the call-back function
                    gotDataCallbackFunction( err, journeys )
                });
            }else{
                console.log("ERROR: creating new journey")
                returnErr(res,"Error creating new journey: "+err);
            }
          });
        })
    }else{
        returnErr(res,"Error creating new journey: NO USER");   
    }
}


//Find all the Journeys from the DB (it is used for the Search function as well)
JourneyData.prototype.findAll = function(theView,res,restUrl, filter,user){
	//console.log("DEBUG Journey find all journeys...")
	var returnErr = this.returnErr
		
	//Prepare the call-back-function
	var gotDataCallbackFunction = function(err, journeys){
		if (err === null ){
            //Open the JourneyView object in charge of prepare the HTML
			theView.render(res,restUrl, journeys )
		}else
			returnErr(res,"Error reading file: "+err);
	}	
    //Asyn process where it retrieves all the Journeys from the DB
    this.db.hgetall('journey',function(err,data){
		//console.log("DEBUG: all journeys as raw data:",data)
		//console.log("DEBUG: songs['2']:",JSON.parse(data['2']).title )
		//Array variable with all the Journeys
        var journeys=[]
        //Iteration of the Journeys from the DB
		for (var i in data){
			//console.log("DEBUG: a journey:",i, data[i] )
            //Create the JSON Journey object from the DB
            var newJourney=JSON.parse( data[i] );
                if (newJourney.user==user){
                //Uses the model Journey object to make a Search with the filter
                newJourney.__proto__ = Journey.prototype; 
                if ( newJourney.fulfillsSearchCriteria(filter) ){
                    //Push the journeys that fullfill the filter (if it's no filter, then all the Journeys fullfill)
                    journeys.push( newJourney );				
                } 
            }
		}
		//console.log("DEBUG: all journeys:",journeys)
		gotDataCallbackFunction( err, journeys );
	});

}
//Function that delete a Journey according to the ID
JourneyData.prototype.deleteById = function(theView,res,restUrl){
	//console.log("DEBUG Journey delete journey by id '"+restUrl.id+"'...")
	var returnErr = this.returnErr;
	//Asyn process that delete the Journey according to the ID
    this.db.hdel("journey",restUrl.id,function(err, data){ // async read data (from db)
		if (err === null ){
			//console.log(" DEL: we got from the database raw data '"+data+"'");
			//Make sure that the object was deleted
            if (data>0)
                //Calls the JourneyView in charge of prepare the HTML
				theView.render(res,restUrl,{status:'SUCCESS',message:"we deleted Journey with id "+restUrl.id}); // call view with the data-item
			else
				returnErr(res,"Delete-Error: Journey with id '"+restUrl.id+"' not found.")
		}else
			returnErr(res,"Error reading database: "+err);
	}); 
}

//Function that finds a Journey according to the ID
JourneyData.prototype.findById = function(theView,res,restUrl){
	//console.log("DEBUG Journey find journey by id '"+restUrl.id+"'...")
	var returnErr = this.returnErr
    //Async process that get the Journey according to the ID
	this.db.hget("journey",restUrl.id,function(err, data){
		if (err === null ){
			//console.log(" we got for Journey id='"+restUrl.id+"' raw db data '"+data+"'");
			//If it retrieves some data
            if (data){
                //Create a variable with the JSON Journey Object
				var journey= JSON.parse( data.toString('UTF-8') )
				//console.log(" => Journey with id "+restUrl.id+":",journey);
				//Calls the JourneyView in charge of prepare the HTML
                theView.render(res,restUrl,journey) // call view with the data-item				
			}else{
				returnErr(res,"Journey with id '"+restUrl.id+"' not found.")				
			}
		}else
			returnErr(res,"Error reading database: "+err);
	}); 
}

//Another function that finds the Journey by the ID, but just receive the id and return the Journey
JourneyData.prototype.findJourneyById = function(id){
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

//Function that Updates a Journey in the DB
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


//Error handler
JourneyData.prototype.returnErr = function(res,msg){
  	res.writeHead(503, {'Content-Type': 'text/plain'});
  	res.end("ERROR: '"+msg+"'\n");	
}
module.exports = JourneyData