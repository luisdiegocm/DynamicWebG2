"use strict";

var User = function(id, user_name, password, email){
    this.id        = id;
    this.user_name = user_name;
    this.password  = password; //Needs to be encrypted
    this.email     = email;
};


//User search can be added in V2
/*Journey.prototype.fulfillsSearchCriteria = function(searchTerm){
    console.log("DEBUG-FILTER we filter by term="+searchTerm+"'")
    if (searchTerm == undefined) {
        return true
    }
    var included=false

    var name = this.name.toLowerCase();
    var country = this.country.toLowerCase();
    var filter=searchTerm.toLowerCase();

    if (name.indexOf(filter) >=0) included=true
    if (country.indexOf(filter) >=0) included=true
    return included
}*/

module.exports = User;