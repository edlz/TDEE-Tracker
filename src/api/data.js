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
    const rows = await queryPromise(
      "SELECT * FROM data_entry WHERE data_entry.userId = ? ORDER BY entryDate DESC",
      [req.user.id]
    );
    let results = new Array();
    for (let i = 0; i < rows.length; i++) {
      results[i] = {
        calories: rows[i].calories,
        weight: rows[i].weight,
        date: rows[i].entryDate.toMysqlFormat(),
        day: rows[i].day,
      };
    }
    res.json(results);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/data/:date
// @desc    get data for user with id
// @access  Private

router.delete("/:date", auth, async (req, res) => {
  try {
    const rows = await queryPromise(
      "SELECT * FROM data_entry WHERE data_entry.userId = ? ORDER BY entryDate DESC",
      [req.user.id]
    );
    if (rows.length <= 1) {
      res.status(500).send("Cannot delete starting entry");
      return;
    }
    await queryPromise(
      "DELETE FROM data_entry WHERE userId = ? AND entryDate = ?",
      [req.user.id, req.params.date]
    );
    res.status(200).send("Deleted entry on date " + req.params.date);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/data
// @desc    enter data for particular date for current user
// @access  Private

// router.post("/", auth, async (req, res) => {
//   try {
//     const rows = await queryPromise(
//       "SELECT * FROM users WHERE users.userId = ?",
//       [req.user.id]
//     );
//     const { calories, weight, units } = req.body;

//     if (rows.length > 0) {
//       // entry exists, replace
//     } else {
//       // new entry
//       const t = Date.now();

//       await queryPromise(
//         "INSERT INTO daily_entry (username, password, created) values(?,?,?)",
//         [username, hash, new Date().toMysqlFormat()]
//       );
//     }
//   } catch (err) {
//     res.status(500).send("Server error");
//   }
// });
module.exports = router;
