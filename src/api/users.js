const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../auth");

// date conversion
const toMysqlFormat = require("../utils/utils");
Date.prototype.toMysqlFormat = toMysqlFormat;
// mysql pooling
const queryPromise = require("../db/connections");

// @route   GET api/users
// @desc    get data on user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const rows = await queryPromise(
      "SELECT * FROM users WHERE id = ? LIMIT 1",
      [req.user.id]
    );
    //console.log(rows[0].created.toString());

    res.json({
      id: rows[0].id,
      username: rows[0].username,
      created: rows[0].created,
      start_date: rows[0].start_date,
    });
  } catch (err) {
    //console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/users
// @desc    register user
// @access  Public
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
    // start_date formatted YYYY-MM-DD
    const { username, password, start_date, start_weight } = req.body;

    try {
      // check user
      const rows = await queryPromise(
        "SELECT * FROM users WHERE username = ? LIMIT 1",
        [username]
      );

      if (rows.length > 0) {
        // user exists, error
        return res.status(400).json({ errors: [{ msg: "Username taken" }] });
      } else {
        // register user
        const salt = await bcrypt.genSaltSync(10);
        const hash = await bcrypt.hashSync(password, salt);

        await queryPromise(
          "INSERT INTO users (username, password, created) values(?,?,?)",
          [username, hash, new Date().toMysqlFormat()]
        );
        //insert start date 0
        const idRow = await queryPromise(
          "SELECT * FROM users WHERE username = ? LIMIT 1",
          [username]
        );

        await queryPromise(
          "INSERT INTO data_entry (userId, weight, entryDate, day) values(?,?,?,1)",
          [idRow[0].id, start_weight, start_date]
        );

        // JWT
        const payload = {
          user: {
            id: idRow[0].id,
          },
        };
        jwt.sign(
          payload,
          config.get("jwtSecret"),
          { expiresIn: 30000 },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
      }
    } catch (err) {
      //console.log(err);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
