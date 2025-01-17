const database = require("./database");

/// get all user information
const getUser = (callback) => {
  const queryText = "SELECT * FROM useracc";
  database.connection.query(queryText, function (err, result) {
    if (result.length > 0) {
      callback(null, result);
    } else {
      callback(err, null);
    }
  });
};
module.exports = {
  getUser,
};
