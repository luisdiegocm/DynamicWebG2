"use strict";
//FileSystem module
var fs = require('fs');

var crypto = require("crypto");

var config = require('../config');

//Model module
var User = require("../model/user_model");
// npm install redis
var redis = require("redis");
//Initialize class
var UserData = function(){
    this.db = redis.createClient(6379,"127.0.0.1");
    this.counter = 0;
};

UserData.prototype.add_user = function(theView,res,restUrl){
    theView.render(res,restUrl,users);
};


var updateUser = function (theView,res, restUrl,user){
    var db = redis.createClient(6379,"127.0.0.1");
    db.hset("user",user.id,JSON.stringify(user), function(err, data){ // async read data (from db)
        if (err === null ){
            console.log(" we saved the User to the database.");
            theView.render(res,restUrl,user) // call view with the data-item
        }else
            returnErr(res,"Error reading database: "+err);
    }); 
    }


UserData.prototype.confirm = function (theView,res,restUrl){
    var userid = restUrl.params['user_id'];
    var keyauth = restUrl.params['auth'];
    
    
    
    this.db.hget("user", userid, function(err, data){ // async read data (from db)
        if (err === null ){
            if (data){
                var user= JSON.parse(data.toString('UTF-8'));
                if (user.keyauth == keyauth){
                    user.confirm=1;
                    //Function that Updates a Journey in the DB
                    updateUser(theView,res,restUrl,user);
                }
            }else{
                returnErr(res,"User with id '" + restUrl.id + "' not found.");
            }
        }else
            returnErr(res,"Error reading database: "+err);
    });
}

//Create a new user
UserData.prototype.create = function(theView,res,restUrl){
    var returnErr = this.returnErr;

    //Prepare the call-back-function
    var getDataCallbackFunction = function(err, users){
        if (err === null ){
            theView.render(res,restUrl,users);
        }else
            returnErr(res,"Error with database: "+err);
    };
    
    var sendAuth = function(user_name,email,userid,key){

            var message = "My Journey\n\nConfirm Registration\n\nDear "+user_name+": You just register to our page. First, we need you to confirm your registration.\n\nClick to the next link for it. \n\n"

            var authlink = "http://" + config.server + ":" + config.port + "/login/confirm.json?user_id=" + userid + "&auth=" + key;

            message += authlink;

            var mail = new Mailer();

            mail.sendMail(email,"MyJourney || Confirm your registration",message,function(err,message){

            });

        }
    var returnErr = this.returnErr;

    var user_name = restUrl.params['user_name'] || "post/get param user_name unknown";
    var password  = restUrl.params['password'] || "post/get param password unknonw"; //Needs to be encrypted
    var email     = restUrl.params['email'] || "post/get param email unknonw";
    var key = crypto.randomBytes(8).toString('hex');
    
    var db = this.db;

    db.incr("SEQUENCE_ID",function(err,data){ //Unique ID
        var idNext = data;
        var user = new User(idNext,user_name, password, email,key);
        db.hset("user", user.id, JSON.stringify(user), function(err, data){ // async read data (from db)
            if (err === null ){
                //Not yet register, first you have to confirm
                sendAuth(user_name,email,user.id,key);
                theView.render(res,restUrl);
            }
            else{
                returnErr(res,"Error creating new user: "+err);
            }
        });
    });
};



UserData.prototype.findAll = function(theView,res,restUrl, filter){
    var returnErr = this.returnErr;

    // prepare the call-back-function
    var getDataCallbackFunction = function(err, users){
        if (err === null ){
            theView.render(res,restUrl, users);
        }else
            returnErr(res,"Error reading file: "+err);
    };

    this.db.hgetall('user', function(err,data){
        var users = [];
        for (var i in data){
            var newUser = JSON.parse(data[i]);
            newUser.__proto__ = User.prototype;
            if ( newUser.fulfillsSearchCriteria(filter) ){
                users.push(newUser);
            }
        }
        getDataCallbackFunction(err, users);
    });
};

UserData.prototype.deleteById = function(theView,res,restUrl){
    console.log("DEBUG User delete user by id '" + restUrl.id + "'...");
    var returnErr = this.returnErr;
    this.db.hdel("user", restUrl.id, function(err, data){ // async read data (from db)
        if (err === null ){
            console.log(" DEL: we got from the database raw data '"+data+"'");
            if (data>0) // hdel: 0 for error, 1 for success
                theView.render(res,restUrl,{status:'SUCCESS', message:"we deleted User with id " + restUrl.id}) // call view with the data-item
            else
                returnErr(res, "Delete-Error: User with id '" + restUrl.id + "' not found.")
        }else
            returnErr(res, "Error reading database: " + err);
    });
};

//
// find a user by it's id
//
UserData.prototype.findById = function(theView,res,restUrl){
    console.log("DEBUG User find user by id '" + restUrl.id + "'...");
    var returnErr = this.returnErr;
    this.db.hget("user", restUrl.id, function(err, data){ // async read data (from db)
        if (err === null ){
            console.log(" we got for User id='" + restUrl.id + "' raw db data '" + data + "'");
            if (data){
                var user= JSON.parse(data.toString('UTF-8'));
                console.log(" => User with id " + restUrl.id + ":", user);
                theView.render(res,restUrl, user); // call view with the data-item
            }else{
                returnErr(res,"User with id '" + restUrl.id + "' not found.");
            }
        }else
            returnErr(res,"Error reading database: "+err);
    });
};

UserData.prototype.findUserById = function(id){
    console.log(id);
    var returnErr = this.returnErr
    this.db.hget("user",id,function(err, data){ // async read data (from db)
        if (err === null ){
            if (data){
                console.log(data.toString('UTF-8'));
                var user= JSON.parse( data.toString('UTF-8') )
                return user;
            }else{
                returnErr(res, "User with id '" + id + "' not found.")
            }
        }else
            returnErr(res,"Error reading database: "+err);
    });
};

// helper:
UserData.prototype.returnErr = function(res,msg){
    res.writeHead(503, {'Content-Type': 'text/plain'});
    res.end("ERROR: '"+msg+"'\n");
};
module.exports = UserData;