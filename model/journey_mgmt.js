"use strict"
//FileSystem module
var fs = require('fs')
//SQLite module
var sqlite = require("sqlite3").verbose();
//Model module
var Journey = require("../model/journey_model")
//Initialize class
var JourneyData = function(){
	console.log("DEBUG Journey initialisation. We setup the db-connection.")
	func();
    /*db.serialize(function() {

            //db.run("CREATE TABLE if not exists JOURNEY (id integer primary key autoincrement, name text not null, start text not null, end text not null, country text not null,summary text not null, image blob)");
            db.run("CREATE TABLE if not exists JOURNEY (id integer primary key autoincrement)");

    });

        db.run("INSERT INTO JOURNEY (name,start,end,country,summary,image) values ('Hungria','3','5','Hungria','Nada',null)");
    
        db.each("SELECT * FROM JOURNEY", function(err, row) {
              console.log(row.id + ": " + row.name);
          });
    db.close();*/
    
}

var func =function(){
    console.log("me cago")
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('mydb.db');
    db['open'] = true;
    console.log(db);
    
    var check;
      db.run("CREATE TABLE if not exists user_info (info TEXT)");
      var stmt = db.prepare("INSERT INTO user_info VALUES (?)");
      for (var i = 0; i < 10; i++) {
          stmt.run("Ipsum " + i);
      }
      stmt.finalize();

      db.each("SELECT rowid AS id, info FROM user_info", function(err, row) {
          console.log(row.id + ": " + row.info);
      });
    db.run("COMMIT");
    db.close();
}
//Create a new Journey
JourneyData.prototype.create = function(theView,res,restUrl){
	var returnErr = this.returnErr
		
	//Prepare the call-back-function
	var gotDataCallbackFunction = function(err, journeys){
		if (err === null ){
			theView.render(res,restUrl,journeys)
		}else
			returnErr(res,"Error with database: "+err);
	}	

	console.log("DEBUG Journey store/persist journey by id '"+restUrl.id+"'...")
	var returnErr = this.returnErr
    
	var name=restUrl.params['name'] || "post/get param name unknown"
	var start=restUrl.params['start'] || "post/get param start unknonw"
	var end=restUrl.params['end'] || "post/get param end unknonw"
	var country=restUrl.params['country'] || "post/get param country unknonw"
	var summary=restUrl.params['summary'] || "post/get param summary unknonw"
    var image=restUrl.params['image'] || "post/get param image unknonw"

    var db = new sqlite.Database('../database/myjourney.db');
    var journey = new Journey(name,start,end,country,summary,image);
    console.log("DEBUG Journey create a new journey with name='"+name);
    var sqlQuery = "INSERT INTO Journey(name,start,end,country,summary,image) values ("+name+","+start+","+end+","+country+","+summary+","+image+")";
    db.run(sqlQuery, function(err, data){ // async read data (from db)
		if (err === null ){
			db.all('SELECT * FROM JOURNEY',function(err,rows){
				console.log("DEBUG: the rows: ",rows)
				var journeys=[]
				for (var i in rows){
					console.log("DEBUG: a journey:",i )
					journeys.push(i)
				}
				console.log("DEBUG: all journeys:",journeys)
				gotDataCallbackFunction( err, journeys )
			});
		}else{
			console.log("ERROR: creating new journey")
			returnErr(res,"Error creating new journey: "+err);
		}
	  });
}

//
// find all the songs (optional: fulfilling a given filter-criterium)
// 
JourneyData.prototype.findAll = function(theView,res,restUrl, filter){
	console.log("DEBUG Journey find all journeys...")
	var returnErr = this.returnErr
		
	// prepare the call-back-function
	var gotDataCallbackFunction = function(err, journeys){
		if (err === null ){ // not: ...=== undefined
			theView.render(res,restUrl, journeys )
		}else
			returnErr(res,"Error reading file: "+err);
	}	
    var db = new sqlite.Database('../database/myjourney.db');
	db.all('SELECT * FROM JOURNEY',function(err,data){
		console.log("DEBUG: all journeys as raw data:",data)
		var journeys=[]
		for (var i in data){
			console.log("DEBUG: a journey:",i)
			var newJourney=i
			// we make a song out of this object :)
			newJourney.__proto__ = Journey.prototype; 
			if ( newJourney.fulfillsSearchCriteria(filter) ){
				journeys.push( newJourney )					
			} 
		}
		console.log("DEBUG: all journeys:",journeys)
		gotDataCallbackFunction( err, journeys )
	});

}

JourneyData.prototype.deleteById = function(theView,res,restUrl){
	console.log("DEBUG Journey delete journey by id '"+restUrl.id+"'...")
	var returnErr = this.returnErr
    
    var db = new sqlite.Database('../database/myjourney.db');
	
    db.run("DELETE FROM JOURNEY WHERE ID="+restUrl.id.toString(),function(err, data){ // async read data (from db)
		if (err === null ){
			console.log(" DEL: we got from the database raw data '"+data+"'");
			if (data>0) //0 for error, 1 for success
				theView.render(res,restUrl,{status:'SUCCESS',message:"we deleted journey with id "+restUrl.id}) // call view with the data-item
			else
				returnErr(res,"Delete-Error: Journey with id '"+restUrl.id+"' not found.")
		}else
			returnErr(res,"Error reading database: "+err);
	}); 
}


//
// find a song by it's id
// 
JourneyData.prototype.findById = function(theView,res,restUrl){
	console.log("DEBUG Journey find journey by id '"+restUrl.id+"'...")
	var returnErr = this.returnErr
    var db = new sqlite.Database('../database/myjourney.db');
	db.all("SELECT * FROM JOURNEY WHERE ID="+restUrl.id.toString(),function(err, data){ // async read data (from db)
		if (err === null ){
			console.log(" we got for Journey id='"+restUrl.id+"' raw db data '"+data+"'");
			if (data){
				var journey= JSON.parse( data.toString('UTF-8') )
				console.log(" => journey with id "+restUrl.id+":",journey);
				theView.render(res,restUrl,journey) // call view with the data-item				
			}else{
				returnErr(res,"Journey with id '"+restUrl.id+"' not found.")				
			}
		}else
			returnErr(res,"Error reading database: "+err);
	}); 
}

// curl -X PUT "http://localhost:8888/testing/song/2.json?title=Another%20bites&artist=queen"
//
// update (=replace) a song with a given id
//
JourneyData.prototype.persistById = function(theView,res,restUrl,song){
    console.log("UPDATE JOURNEY: NOT YET IMPLEMENTED")
    /*
	console.log("DEBUG SongData store/persist songs by id '"+restUrl.id+"'...")
	var returnErr = this.returnErr
	this.db.hset("song",restUrl.id,JSON.stringify(song), function(err, data){ // async read data (from db)
		if (err === null ){
			console.log(" we saved the song to the database.");
			theView.render(res,restUrl,song) // call view with the data-item
		}else
			returnErr(res,"Error reading database: "+err);
	}); */
}


// helper:
JourneyData.prototype.returnErr = function(res,msg){
  	res.writeHead(503, {'Content-Type': 'text/plain'});
  	res.end("ERROR: '"+msg+"'\n");	
}
module.exports = JourneyData