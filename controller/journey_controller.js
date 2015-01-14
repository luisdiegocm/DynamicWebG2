"use strict";

//Modules within the Project
var JourneyData    = require("../model/journey_mgmt");
var Journey 	   = require("../model/journey_model");
var JourneyView    = require("../view/journey_view");
	
//Init 
var JourneyController = function(){
	//console.log("DEBUG JourneyController initialise the redis db ONCE!");
	this.journeyData=new JourneyData();
	this.journeyView=new JourneyView();
};

//Handles the petition from the main_controller
JourneyController.prototype.handle = function(restUrl,res,user){
	//If want to retrieve all the Journeys
	if (restUrl.id == "all"){
        //Call the findAll function that show all the Journeys
		this.journeyData.findAll( this.journeyView,res,restUrl,undefined,user);
    //If want to create a Journey
	}else if (restUrl.id == 'create'){ 
		this.journeyData.create( this.journeyView ,res,restUrl,user);
	}//If you are adding a Journey
    else if (restUrl.id == "add"){
        this.journeyView.render(res,restUrl)
    }//If want to edit in the first time (just to show the Edit UI)
    else if (restUrl.resource == "edit" && restUrl.params == {}){
        this.journeyView.render(res,restUrl)
    }//If want to search a Journey
    else if (restUrl.id == 'search'){
        //Variable with the "searchterm"
		var searchTerm=restUrl.params['searchterm'];
        //Call the findAll but with the filter
		this.journeyData.findAll( this.journeyView ,res,restUrl,searchTerm,user);
	}else{ 
        //If the id is a number, then it should be a Update or Delete function
		var no = parseInt(restUrl.id);
        //If its really a number
		if (!isNaN(no)){
			//console.log("DEBUG JourneyController handle: id='"+no+"'");
            //If want to Update the Journey
			if (restUrl.method=='PUT'){
                //Receive the variables of Journey to update them
				var name=restUrl.params['name'] || "please specify data";
                var start=restUrl.params['start'] || "please specify data";
                var end=restUrl.params['end'] || "please specify data";
                var country=restUrl.params['country'] || "please specify data";
                var summary=restUrl.params['summary'] || "please specify data";
                var image=restUrl.params['image'] || "please specify data";
                //Create a new object Journey
				var newJourney= new Journey(restUrl.id,name,start,end,country,summary,image,user);
                //Call the Update Function
				this.journeyData.persistById( this.journeyView ,res,restUrl,newJourney);
			}//If want to Delete a Journey
            else if (restUrl.method=='DELETE'){
				new JourneyData().deleteById( this.journeyView ,res,restUrl);
			}//If just want to GET the data
            else{
                //Create a View Variable
				var theView = new JourneyView();
				this.journeyData.findById( this.journeyView ,res,restUrl);
			}
		}else{
			console.log("DEBUG JourneyController handle: id unknown:",restUrl.id);
			var msg="DEBUG JourneyController: id should be a number or 'first' or 'all'."+
					" We do not know how to handle '"+restUrl.id+"'!";
			this.journeyView.renderError(res,restUrl,msg);
		}
	}
	
}

//Create the Controller
var journeyController=new JourneyController();
module.exports = journeyController;
