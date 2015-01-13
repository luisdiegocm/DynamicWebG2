var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('users.db');
var check;
db.serialize(function() {
    db.run("CREATE TABLE my_journey_db (info text)");

    var stmt = db.prepare("INSERT INTO my_journey_db VALUES");//Values need to come from helper?
});
db.close();