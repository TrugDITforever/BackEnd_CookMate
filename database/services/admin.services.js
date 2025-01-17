const database = require("../database");

//get all the food items
const fetchFoodData = (callback) => {
  const queryText = "SELECT * FROM food ORDER BY RAND() LIMIT 5 ";
  database.connection.query(queryText, function (err, result) {
    if (result.length > 0) {
      callback(null, result);
    } else {
      callback(err, null);
    }
  });
};
module.exports = {
  fetchFoodData,
};
