const express = require("express");
const router = express.Router();
const auth = require("../auth");

// date conversion
const toMysqlFormatDay = require("../helper");
Date.prototype.toMysqlFormat = toMysqlFormatDay;

// mysql pooling
const queryPromise = require("../db/connections");

// @route   GET api/calories
// @desc    get all calories for current user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const rows = await queryPromise(
      "SELECT * FROM data_entry WHERE userId = ? AND calories IS NOT NULL ORDER BY entryDate DESC",
      [req.user.id]
    );
    let results = new Array();
    for (let i = 0; i < rows.length; i++) {
      results[i] = {
        calories: rows[i].calories,
        date: rows[i].entryDate,
        day: rows[i].day,
      };
    }
    res.json(results);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route   POST api/calories
// @desc    set calories on day for user formatted YYYY-MM-DD
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const eday = new Date(req.body.day);
    const rows = await queryPromise(
      "SELECT * FROM data_entry WHERE userId = ? AND entryDate = ?",
      [req.user.id, eday.toMysqlFormat()]
    );

    if (rows.length > 0) {
      // entry exists, update calories
      await queryPromise(
        "UPDATE data_entry SET calories = ? WHERE userId = ? AND entryDate = ?",
        [req.body.calories, req.user.id, eday.toMysqlFormat()]
      );
      res.status(200).send("calories updated on " + eday.toMysqlFormat());
    } else {
      // new entry
      const start = await queryPromise(
        "SELECT * FROM users WHERE users.id = ?",
        [req.user.id]
      );
      const startDate = start[0].start_date;

      await queryPromise(
        "INSERT INTO data_entry (userId, calories, entryDate, day) values(?,?,?,?)",
        [
          req.user.id,
          req.body.calories,
          eday.toMysqlFormat(),
          Math.floor((eday - startDate) / (24 * 60 * 60 * 1000)) + 1,
        ]
      );
      res.status(200).send("calories set on " + eday.toMysqlFormat());
    }
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
