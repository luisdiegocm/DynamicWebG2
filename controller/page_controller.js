"use strict"

var PageView = require("../view/page_view")
	
var PageController = function(){
	//console.log("DEBUG PageController initialise: not implemented yet")
}

PageController.prototype.handle = function(restUrl,res){
	//Evaluates which HTML layout is required
    if (restUrl.id == "index"){
		var View = new PageView()
		View.render(res,restUrl)
	}else if (restUrl.id == 'about'){
		var theView = new PageView()
		theView.render(res,restUrl)
	}else if (restUrl.id == 'login'){
		var theView = new PageView()
		theView.render(res,restUrl)
	}else{ 
		console.log("DEBUG PageController handle: id unknown:",restUrl.id)
		var msg="DEBUG PageController: id should be 'welcome' or 'about' or '...'."+
				" We do not know how to handle '"+restUrl.id+"'!"
	}
	
}
var pageController = new PageController()
module.exports = pageController
