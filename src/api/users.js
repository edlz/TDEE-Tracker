const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../auth");

// date conversion
const toMysqlFormat = require("../helper");
Date.prototype.toMysqlFormat = toMysqlFormat;
// mysql pooling
const queryPromise = require("../db/connections");

// @route   GET api/users
// @desc    get data on user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const rows = await queryPromise(
      "SELECT * FROM users WHERE users.id = ? LIMIT 1",
      [req.user.id]
    );
    //console.log(rows[0].created.toString());

    res.json({
      id: rows[0].id,
      username: rows[0].username,
      created: rows[0].created,
    });
  } catch (err) {
    console.error(err.message);
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
    const { username, password } = req.body;

    try {
      // check user
      const rows = await queryPromise(
        "SELECT * FROM users WHERE users.username = ? LIMIT 1",
        [username]
      );

      if (rows.length > 0) {
        // user exists, error
        return res.status(400).json({ errors: [{ msg: "User exists" }] });
      } else {
        // register user
        const salt = await bcrypt.genSaltSync(10);
        const hash = await bcrypt.hashSync(password, salt);

        const t = Date.now();

        await queryPromise(
          "INSERT INTO users (username, password, created) values(?,?,?)",
          [username, hash, new Date().toMysqlFormat()]
        );

        // JWT
        const idRow = await queryPromise(
          "SELECT * FROM users WHERE users.username = ? LIMIT 1",
          [username]
        );
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
      console.log(err);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
