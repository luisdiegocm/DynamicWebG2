"use strict"
var fs = require('fs')
var UserData = require("../model/user_mgmt");
// npm install redis
var redis = require("redis")

var LoginView = function(){
    console.log("DEBUG user initialise...")
    this.layout="view/layout.html"
    this.confirm="view/login/confirm_template.html";
    /*
    this.journey_template	="view/journey/journey_template.html"
    this.journeys_template	="view/journey/journeys_template.html"*/
    this.login = "view/login/login_template.html";
    this.db = redis.createClient(6379,"127.0.0.1")
};

LoginView.prototype.formatHtml = function(res,restUrl,data,htmlTemplate){
    var result = htmlTemplate;

    if (restUrl.id == "login"){
        // send html data back to client
        res.writeHead(200, {'Content-Type': 'text/html'} );
        res.end(result);
    }else if (restUrl.id == "confirm"){
        result.replace("{CONTENT}","Dear "+data.user_name+". Your confimation was received correctly. Now you can log in");
        res.writeHead(200, {'Content-Type': 'text/html'} );
        res.end(result);
    }
};

LoginView.prototype.getDetailTemplate = function(loginView, res, restUrl, data, layoutHtml){
    //Grab the format of the query
    var format = restUrl.format;

    var returnErr = this.returnErr
    //If you are searching
    if(restUrl.id == "login"){
        var filenameDetailTemplate = this.login;
    }else if (restUrl.id == "confirm"){
        var filenameDetailTemplate = this.confirm;
    }

    console.log("Template for Details: '"+filenameDetailTemplate+"'");
    // put it into the layout
    fs.readFile(filenameDetailTemplate,function(err, layoutdata){
        if (err === null ){
            var templateDetail= layoutdata.toString('UTF-8')
            if (restUrl.resource=="edit"){
                templateDetail+="<button id='saveJourney_"+restUrl.id+"' onclick = 'javascript:editJourney("+restUrl.id+")'>Save Journey</button>"
            }
            var htmlTemplate = layoutHtml.replace("{CONTENTS}",templateDetail)

            loginView.formatHtml(res,restUrl,data,htmlTemplate);
        }else{
            returnErr(res,"Error reading detail-template file '"+filenameDetailTemplate+"' for journeys: "+err);}
    });
};

LoginView.prototype.getOverallLayout = function(loginView, res,restUrl,data){
    var filenameLayout=this.layout
    //console.log("DEBUG Journey render in format HTML with template '"+filenameLayout+"'")
    var returnErr = this.returnErr
    fs.readFile(filenameLayout,function(err, filedata){ // async read data (from fs/db)
        if (err === null ){
            var layoutHtml= filedata.toString('UTF-8')
            loginView.getDetailTemplate(loginView,res,restUrl,data,layoutHtml)
        }else
            returnErr(res,"Error reading global layout-template file '"+filenameLayout+"'. Error "+err);
    })
};
LoginView.prototype.render = function(res,restUrl ,data){
    var format = restUrl.format
    console.log("DEBUG user render in format: ",format)

    var loginView = this // we save the reference/pointer to this object

    if (format=="json"){ // content type for JSON
        if (restUrl.id=="confirm"){
            this.getOverallLayout(loginView,res,restUrl,data);
        }else{
            console.log("DEBUG: NEED TO IMPROVE FROM DATA "+data)
            res.writeHead(200, {'Content-Type': 'application/json'} );
            // format out data <= here into JSON
            var result = JSON.stringify(data) // fill template
            result +="\n"
            res.end(result); // return formatted data to the client
        }

    }else if (format=="html"){
        // now we render one journey, many journeys or the journey-search form
        if (data)
            this.getOverallLayout(loginView, res,restUrl,data)
        else
            this.getOverallLayout(loginView, res,restUrl)

    }else{
        this.returnErr(res,"Error: The specified format '"+format+"' is unknown!")
    }
};

// JSON render Not-Implemented Error on data-loading
LoginView.prototype.renderNotImplemented = function(res,restUrl,data){
    console.log("DEBUG User render not implemented yet.")
    res.writeHead(400, {'Content-Type': 'application/json'} );
    res.end( JSON.stringify(data)+"\n" );
};
// JSON render Error on data-loading
LoginView.prototype.renderError = function(res,restUrl,data){
    console.log("DEBUG User render not implemented yet.")
    res.writeHead(404, {'Content-Type': 'application/json'} );
    res.end(  JSON.stringify(data)+"\n" );
};
module.exports = LoginView;

// helper Errors for this view:
LoginView.prototype.returnErr = function(res,msg){
    console.log("DEBUG User: "+msg)
    res.writeHead(503, {'Content-Type': 'text/plain'});
    res.end("ERROR: '"+msg+"'\n");
};

