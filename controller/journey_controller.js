"use strict"

var JourneyData = require("../model/journey_mgmt");
var Journey 	 = require("../model/journey_model");
var JourneyView = require("../view/journey_view");
	
var JourneyController = function(){
	console.log("DEBUG JourneyController initialise the redis db ONCE!");
	this.journeyData=new JourneyData();
	this.journeyView=new JourneyView();
};

JourneyController.prototype.handle = function(restUrl,res){
	
	if (restUrl.id == "all"){
		this.journeyData.findAll( this.journeyView ,res,restUrl);
	}else if (restUrl.id == 'create'){ 
		this.journeyData.create( this.journeyView ,res,restUrl);
	}else if (restUrl.id == 'first'){
		var msg="DEBUG JourneyController: TODO implement action 'first'";
		this.journeyView.renderNotImplemented(res,restUrl,msg);
	}else if (restUrl.id == "add"){
        this.journeyView.render(res,restUrl)
    }else if (restUrl.resource == "edit" && restUrl.params == {}){
        this.journeyView.render(res,restUrl)
    }else if (restUrl.id == 'search'){
		var searchTerm=restUrl.params['searchterm'];
		this.journeyData.findAll( this.journeyView ,res,restUrl,searchTerm); // we filter by searchTerm
	}else{ 
		var no = parseInt(restUrl.id);
		if (!isNaN(no)){
			console.log("DEBUG JourneyController handle: id='"+no+"'");
			if (restUrl.method=='PUT'){ //we update an id
				var name=restUrl.params['name'] || "please specify data";
                var start=restUrl.params['start'] || "please specify data";
                var end=restUrl.params['end'] || "please specify data";
                var country=restUrl.params['country'] || "please specify data";
                var summary=restUrl.params['summary'] || "please specify data";
                var image=restUrl.params['image'] || "please specify data";
				var newJourney= new Journey(restUrl.id,name,start,end,country,summary,image);
				this.journeyData.persistById( this.journeyView ,res,restUrl,newJourney);
			}else if (restUrl.method=='DELETE'){ // we update an id
				new JourneyData().deleteById( this.journeyView ,res,restUrl);
			}else{ // just GET the data
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

// we create a songController OBJECT and return it:
var journeyController=new JourneyController();
module.exports = journeyController;
