var email   = require("emailjs");

Mailer = function(){
	console.log("Configuring the mailer...")
	this.server  = email.server.connect({
           user:    "myjourney.dynweb@hotmail.com", 
           password:"AnnaDiegoFawas14", 
           host:    "smtp-mail.outlook.com", 
           tls: {ciphers: "SSLv3"}
        });
}
Mailer.prototype.sendMail = function(to,subject,message){
	console.log("Prepare to mail to '"+to+"'")
	// send the message and get a callback with an error or details of the message that was sent
        this.server.send({
           text:    message, 
           from:    "myjourney.dynweb@hotmail.com", 
           to:      to,
           subject: "My Journey || Confirm your registration"
        }, function(err, message) { console.log(err || message); });
}


        

        
module.exports.Mailer = Mailer