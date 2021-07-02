const express = require("express");
const router = express.Router();
const auth = require("../auth");

// mysql pooling
const queryPromise = require("../db/connections");

// @route   GET api/data
// @desc    get data for user with id
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    console.log(req.user.id);
    const rows = await queryPromise(
      "SELECT * FROM daily_entry WHERE daily_entry.userId = ?",
      [req.user.id]
    );
    console.log(rows);
    res.status(200).send("test");
    //console.log(rows);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route   POST api/data
// @desc    enter data for particular date for current user
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const rows = await queryPromise(
      "SELECT * FROM users WHERE users.userId = ?",
      [req.user.id]
    );
    const { calories, weight, units } = req.body;

    if (rows.length > 0) {
      // entry exists, replace
    } else {
      // new entry
      const t = Date.now();

      await queryPromise(
        "INSERT INTO daily_entry (username, password, created) values(?,?,?)",
        [username, hash, new Date().toMysqlFormat()]
      );
    }
  } catch (err) {
    res.status(500).send("Server error");
  }
});
module.exports = router;
