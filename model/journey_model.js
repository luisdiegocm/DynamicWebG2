"use strict"
	
var Journey = function(id,name,start,end,country,summary,image){
	this.id=id
	this.name=name
	this.start=start
    this.end = end
    this.country = country;
    this.summary = summary;
    this.image = image || null
}

Journey.prototype.toString = function(){
	return "This is the Journey '"+this.name+"'."
}

Journey.prototype.fulfillsSearchCriteria = function(searchTerm){
	console.log("DEBUG-FILTER we filter by term="+searchTerm+"'")
	if (searchTerm == undefined) {
        return true
    }
	var included=false
    
	if (this.name.indexOf(searchTerm) >=0) included=true 
	if (this.country.indexOf(searchTerm) >=0) included=true 
	return included
}


module.exports = Journey