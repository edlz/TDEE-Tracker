const express = require("express");
const router = express.Router();
const auth = require("../auth");

const updateDays = require("../utils/updateDays");
// mysql pooling
const { queryPromise } = require("../db/connections");

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
      return res
        .status(400)
        .json({ errors: [{ msg: "Cannot delete starting entry" }] });
    }
    await queryPromise(
      "DELETE FROM data_entry WHERE userId = ? AND entryDate = ?",
      [req.user.id, req.params.date]
    );
    //update first day to 1
    await updateDays(req.user.id);
    res.status(200).send("Deleted entry on date " + req.params.date);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
