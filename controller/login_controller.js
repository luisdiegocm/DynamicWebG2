"use strict";

//Modules within the Project
var UserData    = require("../model/user_mgmt");
var User 	   = require("../model/user_model");
var UserView    = require("../view/user_view");

//Init
var UserController = function(){
    this.userData = new UserData();
    this.userView = new UserView();
};

//Handles the petition from the main_controller
UserController.prototype.handle = function(restUrl,res){
    //If want to retrieve all the Users
    if (restUrl.id == "all"){
        //Call the findAll function that show all the Users
        this.userData.findAll( this.userView,res,restUrl);
        //If want to create a User
    }else if (restUrl.id == 'create'){
        this.userData.create( this.userView ,res,restUrl);
    }//If you are adding a User
    else if (restUrl.id == "add"){
        this.userView.render(res,restUrl)
    }else{
        var no = parseInt(restUrl.id);
        if (!isNaN(no)){
            if (restUrl.method=='PUT'){
                //Receive the variables of User to update them
                var user_name = restUrl.params['user_name'] || "please specify data";
                var password  = restUrl.params['password'] || "please specify data";
                var email     = restUrl.params['email'] || "please specify data";
                //Create a new object User
                var newUser= new User(restUrl.id, user_name, password, email);
                //Call the Update Function
                this.userData.persistById( this.userView ,res,restUrl,newUser);
            }//If want to Delete a User
            else if (restUrl.method=='DELETE'){
                new UserData().deleteById( this.userView ,res,restUrl);
            }//If just want to GET the data
            else{
                //Create a View Variable
                var theView = new UserView();
                this.userData.findById( this.userView ,res,restUrl);
            }
        }else{
            console.log("DEBUG UserController handle: id unknown:",restUrl.id);
            var msg="DEBUG UserController: id should be a number or 'first' or 'all'."+
                " We do not know how to handle '"+restUrl.id+"'!";
            this.userView.renderError(res,restUrl,msg);
        }
    }
};

//Create the Controller
var userController = new UserController();
module.exports     = userController;
