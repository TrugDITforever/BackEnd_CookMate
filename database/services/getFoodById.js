const database = require("../database");
const getFoodById = (id, callback) => {
  const queryText = " SELECT * FROM food Where foodID = ?";
  const values = [id];
  database.connection.query(queryText, values, function (err, result) {
    if (result.length > 0) {
      callback(null, result);
    } else {
      callback(err, null);
    }
  });
};
module.exports = {
  getFoodById,
};
