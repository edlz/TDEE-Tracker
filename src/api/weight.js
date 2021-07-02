const express = require("express");
const router = express.Router();
const auth = require("../auth");

// date conversion
const toMysqlFormatDay = require("../helper");
Date.prototype.toMysqlFormat = toMysqlFormatDay;

// mysql pooling
const queryPromise = require("../db/connections");

// @route   GET api/weight
// @desc    get all weights for current user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const rows = await queryPromise(
      "SELECT * FROM weights WHERE weights.userId = ? ORDER BY weights.entryDate DESC",
      [req.user.id]
    );
    console.log(rows);
    let results = new Array();
    for (let i = 0; i < rows.length; i++) {
      results[i] = {
        weight: rows[i].weightLB,
        date: rows[i].entryDate,
      };
    }
    res.json(results);
    //console.log(rows);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route   POST api/weight
// @desc    set weight on day for user
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const eday = new Date(req.body.day).toMysqlFormat();
    const rows = await queryPromise(
      "SELECT * FROM weights WHERE weights.userId = ? AND weights.entryDate = ?",
      [req.user.id, eday]
    );

    if (rows.length > 0) {
      // entry exists, replace
      await queryPromise(
        "UPDATE weights SET weightLB = ? WHERE userId = ? AND entryDate = ?",
        [req.body.weight, req.user.id, eday]
      );
      res.status(200).send("Weight updated on " + eday);
    } else {
      // new entry

      await queryPromise(
        "INSERT INTO weights (userId, weightLB, entryDate) values(?,?,?)",
        [req.user.id, req.body.weight, eday]
      );
      res.status(200).send("Weight set on " + eday);
    }
  } catch (err) {
    res.status(500).send("Server error");
  }
});
module.exports = router;
