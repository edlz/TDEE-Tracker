const express = require("express");
const router = express.Router();
const auth = require("../auth");

// mysql pooling
const { queryPromise } = require("../db/connections");

// @route   GET api/goals
// @desc    get goals for user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const rows = await queryPromise(
      "SELECT * FROM goals WHERE goals.userId = ?",
      [req.user.id]
    );
    console.log(rows);
    if (rows.length > 0) {
      let weight_loss_weekly = null;
      if (rows[0].calorie_deficit) {
        weight_loss_weekly = rows[0].calorie_deficit / 500;
      }
      res.json({
        calorie_deficit: rows[0].calorie_deficit,
        weekly_lb_lost: weight_loss_weekly,
        goal_weight: rows[0].goal_weight,
      });
    } else {
      res.status(400).send("No goals set");
    }

    //console.log(rows);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route   POST api/goals
// @desc    set goals for current user
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const rows = await queryPromise(
      "SELECT * FROM goals WHERE goals.userId = ?",
      [req.user.id]
    );

    if (rows.length > 0) {
      // entry exists, replace
      await queryPromise(
        "UPDATE goals SET goal_weight = ?, calorie_deficit = ? WHERE userId = ?",
        [
          req.body.goal_weight ? req.body.goal_weight : rows[0].goal_weight,
          req.body.calorie_deficit
            ? req.body.calorie_deficit
            : rows[0].calorie_deficit,
          req.user.id,
        ]
      );
      res.status(200).send("Goals updated");
    } else {
      // new entry

      await queryPromise(
        "INSERT INTO goals (userId, goal_weight, calorie_deficit) values(?,?,?)",
        [req.user.id, req.body.goal_weight, req.body.calorie_deficit]
      );
      res.status(200).send("Goals created");
    }
  } catch (err) {
    res.status(500).send("Server error");
  }
});
module.exports = router;
