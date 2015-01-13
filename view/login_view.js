"use strict"
var fs = require('fs')
var UserData = require("../model/user_mgmt");
// npm install redis
var redis = require("redis")

var LoginView = function(){
    console.log("DEBUG user initialise...")
    this.layout="view/layout.html"
    /*
    this.journey_template	="view/journey/journey_template.html"
    this.journeys_template	="view/journey/journeys_template.html"*/
    this.login = "view/login/login.html";
    this.db = redis.createClient(6379,"127.0.0.1")
};

LoginView.prototype.formatHtml = function(res,restUrl,data,htmlTemplate){
    var result = htmlTemplate;

    if (restUrl.id == "add"){
        // send html data back to client
        res.writeHead(200, {'Content-Type': 'text/html'} );
        res.end(result);
    }
    else{ // a single song:
        // TODO smarter replacement
        if (data && data.name)
            console.log(result);
        result=result.replace(/{NAME}/g,data.name)
            .replace(/{START}/g,data.start)
            .replace(/{END}/g,data.end)
            .replace(/{COUNTRY}/g,data.country)
            .replace(/{SUMMARY}/g,data.summary)
            .replace(/img src=''/g,"img src='"+data.image+"' ");

        // send html data back to client
        res.writeHead(200, {'Content-Type': 'text/html'} );
        res.end(result);

        //var preview = document.querySelector('img'); //selects the query named img
        //preview.src = data.image;
    }
};

LoginView.prototype.getDetailTemplate = function(userView, res, restUrl, data, layoutHtml){
    //Grab the format of the query
    var format = restUrl.format;
    //If you are searching
    if(restUrl.id == "login"){
        var filenameDetailTemplate = this.login
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

            userView.formatHtml(res,restUrl,data,htmlTemplate);
        }else
            returnErr(res,"Error reading detail-template file '"+filenameDetailTemplate+"' for journeys: "+err);
    });
};

LoginView.prototype.getOverallLayout = function(userView, res,restUrl,data){
    var filenameLayout=this.layout
    //console.log("DEBUG Journey render in format HTML with template '"+filenameLayout+"'")
    var returnErr = this.returnErr
    fs.readFile(filenameLayout,function(err, filedata){ // async read data (from fs/db)
        if (err === null ){
            var layoutHtml= filedata.toString('UTF-8')
            userView.getDetailTemplate(userView,res,restUrl,data,layoutHtml)
        }else
            returnErr(res,"Error reading global layout-template file '"+filenameLayout+"'. Error "+err);
    })
};
LoginView.prototype.render = function(res,restUrl ,data){
    var format = restUrl.format
    console.log("DEBUG user render in format: ",format)

    var userView = this // we save the reference/pointer to this object

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
            this.getOverallLayout(userView, res,restUrl,data)
        else
            this.getOverallLayout(userView, res,restUrl)

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

