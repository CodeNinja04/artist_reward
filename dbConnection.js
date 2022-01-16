var mysql = require('mysql');
var conn = mysql.createConnection({
  host: "localhost",

  user: "hemendra",

  password: "Hemendra@1004",

  database: "artistreward",
});
 
conn.connect(function(err) {
  if (err) throw err;
  console.log('Database is connected successfully !');
});
module.exports = conn;