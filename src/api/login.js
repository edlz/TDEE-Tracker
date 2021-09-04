const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

const router = express.Router();
const { check, validationResult } = require("express-validator");
// mysql pooling
const { queryPromise } = require("../db/connections");

// @route   POST api/login
// @desc    login user
// @access  Public
router.post(
  "/",
  [
    check("username", "Username Required").exists(),
    check("password", "Password Required").exists(),
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
        // check login info=
        if (await bcrypt.compare(password, rows[0].password)) {
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
        } else {
          return res
            .status(400)
            .json({ errors: [{ msg: "Incorrect Password" }] });
        }
      } else {
        // error
        return res
          .status(400)
          .json({ errors: [{ msg: "Username does not exist" }] });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
