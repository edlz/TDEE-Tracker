const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { check, validationResult } = require("express-validator");

// mysql pooling
const pool = require("../db/connections");

// @route   POST api/users
// @desc    register user
// @access  Private
router.post(
  "/",
  [
    check("username", "Username Required").not().isEmpty(),
    check("password", "Password needs to be 8 or more characters").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ errors: err.array() });
    }
    const { username, password } = req.body;

    try {
      // check user
      const rows = await new Promise((resolve, reject) => {
        pool.query(
          "select * from users where users.username = ? limit 1;",
          [username],
          (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows);
            }
          }
        );
      });
      if (rows.length > 0) {
        // user exists, error
        return res.status(400).json({ errors: [{ msg: "User exists" }] });
      } else {
        // register user
        const salt = await bcrypt.genSaltSync(10);
        const hash = await bcrypt.hashSync(password, salt);

        await new Promise((resolve, reject) => {
          pool.query(
            "INSERT INTO users (username, password) values(?,?)",
            [username, hash],
            (err, rows) => {
              if (err) {
                reject(err);
              } else {
                resolve(rows);
              }
            }
          );
        });
        res.send("user registered");
      }
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
