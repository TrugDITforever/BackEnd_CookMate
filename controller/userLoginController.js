const userService = require("../database/services/user.serviecs");

/// controller for userlogin
exports.userLogin = (req, res) => {
  const state = req.body;
  console.log(state);
  userService.userlogin(state.email, state.password, (err, rows) => {
    if (rows && rows.length > 0) {
      const userData = rows[0];
      res.status(200).json({
        dataUser: userData,
        success: true,
      });
      console.log(rows);
    } else {
      res.status(200).json({
        success: false,
      });
    }
  });
};
