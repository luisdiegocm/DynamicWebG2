"use strict";

//Modules within the Project
var UserData    = require("../model/user_mgmt");
var User 	    = require("../model/user_model");
var UserView    = require("../view/login_view");

//Init
var UserController = function(){
    this.userData = new UserData();
    this.userView = new UserView();
};

//Handles the petition from the main_controller
UserController.prototype.handle = function(restUrl,res){
    //If you are adding a User
    if (restUrl.id == "login"){
        this.userView.render(res,restUrl)
    }else if (restUrl.id == "create"){
        //register

        this.userData.create( this.userView ,res,restUrl);
    }else if (restUrl.id == "authentication"){
        //login auth
    }else if (restUrl.id == "confirm"){
        //confirm email
    }


};

//Create the Controller
var userController = new UserController();
module.exports     = userController;
