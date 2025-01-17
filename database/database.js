const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mobileApp",
});
connection.connect(function (err) {
  if (err) {
    console.log("Error occurred while connecting to the database");
  }
});
module.exports = {
  connection,
};
