const database = require("../database");
/// check account for User login
const userlogin = (email, password, callback) => {
  const queryText = " SELECT * FROM useracc Where password = ? and email = ?";
  const values = [password, email];
  database.connection.query(queryText, values, function (err, result) {
    if (result.length > 0) {
      callback(null, result);
    } else {
      callback(err, null);
    }
  });
};
const userRegister = (fullname, email, password, callback) => {
  const queryText =
    "INSERT INTO useracc (fullname, username, password) VALUES (?,?,?)";
  const values = [fullname, email, password];
  database.connection.query(queryText, values, function (err, result) {
    if (err) {
      callback(err, "something went wrong");
    } else {
      callback(null, result);
    }
  });
};
module.exports = {
  userlogin,
  userRegister,
};
