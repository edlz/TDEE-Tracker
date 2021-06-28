const express = require("express");
const router = express.Router();
const auth = require("../auth");

// mysql pooling
const queryPromise = require("../db/connections");

// @route   GET api/data
// @desc    get data on date
// @access  Private
router.get("/", auth, (req, res) => {
  try {
    const rows = queryPromise(
      "SELECT * FROM daily_entry WHERE daily_entry.userId = ? LIMIT 1",
      [req.user.id]
    );
    //console.log(rows);
  } catch (err) {
    res.status(500);
  }
});

module.exports = router;
