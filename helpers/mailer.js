var nodemailer = require('nodemailer');

Mailer = function(){
	console.log("Configuring the mailer...")
	this.from="johannes.feiner@fh-joanneum.at"
	this.options={
        service: 'gmail',
        auth: {
        user: 'sender@gmail.com',
        pass: 'password'
        }
    }
}
Mailer.prototype.sendMail = function(callback,to,subject,message){
	var transporter = nodemailer.createTransport( this.options );
	console.log("Prepare to mail to '"+to+"'")
	transporter.sendMail({ // in the background:
		    from: this.from,
			to: to,
		    subject: subject,
		    html: message,
		}, function(err,info){
			if (err) {
				throw err
			}else {
				console.log("Final Message-ID: ", info.messageId)
				callback()
			}
		});
}

var transporter = nodemailer.createTransport({);
transporter.sendMail({
    from: 'sender@address',
    to: 'receiver@address',
    subject: 'hello',
    text: 'hello world!'
});

module.exports = Mailer