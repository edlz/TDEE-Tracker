const express = require("express");
const router = express.Router();
const auth = require("../auth");

// date conversion
const toMysqlFormatDay = require("../utils");
Date.prototype.toMysqlFormat = toMysqlFormatDay;

// mysql pooling
const queryPromise = require("../db/connections");

// 1. if week is 1, calculate first week tdee
// 2. else, calculate weekly tdee and average over past tdees
//
// If calorie_row_count = 0 or weight_row_count = 0:
//     return Previous tdee
// Else:
//     currWeekTdee = Average calories week + (-1*weight_delta*3500/calorie_row_count)
//     return average tdee over past 6 weeks

function weeklyTDEE(weekNum, resultSet) {
  // memo
  let tdeeArray = new Array();
  let averageCaloriesMemo = new Array();
  let averageWeightMemo = new Array();
  for (let j = 1; j <= weekNum; j++) {
    // get weight and calories for week j
    // console.log("tdee array:");
    // console.log(tdeeArray);
    // console.log();
    let weightsArray = new Array();
    let caloriesArrayAll = new Array();
    for (let i = 0; i < 7; i++) {
      weightsArray.push(null);
      caloriesArrayAll.push(null);
    }
    if (j > 1) {
      weightsArray.fill(averageWeightMemo[j - 2]);
      caloriesArrayAll.fill(averageCaloriesMemo[j - 2]);
    }

    for (let i = 0; i < resultSet.length; i++) {
      if (resultSet[i].day >= 7 * j - 6 && resultSet[i].day <= 7 * j) {
        if (resultSet[i].weight != null) {
          weightsArray.fill(resultSet[i].weight, (resultSet[i].day - 1) % 7);
        }
        if (resultSet[i].calories != null) {
          caloriesArrayAll.fill(
            resultSet[i].calories,
            (resultSet[i].day - 1) % 7
          );
        }
      }
    }

    let caloriesArray = caloriesArrayAll.filter(function (x) {
      return x != null;
    });

    // console.log(weightsArray);
    // console.log(caloriesArray);

    // first week (base)
    if (j == 1) {
      if (weightsArray.length == 0 || caloriesArray.length == 0) {
        tdeeArray.push(resultSet[0].weight * 13);
      } else {
        const averageWeight =
          weightsArray.reduce((acc, val) => acc + val) / weightsArray.length;
        averageWeightMemo.push(averageWeight);
        const weightDelta =
          weightsArray.length > 0 ? weightsArray[0] - averageWeight : 0;
        const averageCalories =
          caloriesArray.reduce((acc, val) => acc + val) / caloriesArray.length;
        averageCaloriesMemo.push(averageCalories);
        tdeeArray.push(averageCalories + weightDelta * 500);
      }
    } else {
      // iterations
      if (weightsArray.length == 0 || caloriesArray.length == 0) {
        tdeeArray.push(tdeeArray[tdeeArray.length - 1]);
      } else {
        const averageWeight =
          weightsArray.reduce((acc, val) => acc + val) / weightsArray.length;
        averageWeightMemo.push(averageWeight);

        const weightDelta =
          weightsArray.length > 0 ? weightsArray[0] - averageWeight : 0;
        const averageCalories =
          caloriesArray.reduce((acc, val) => acc + val) / caloriesArray.length;
        averageCaloriesMemo.push(averageCalories);
        let recentTdee = new Array();
        recentTdee.push(averageCalories + weightDelta * 500);
        for (let i = j - 6; i < j - 1; i++) {
          if (i >= 0) {
            recentTdee.push(tdeeArray[i]);
          }
        }
        tdeeArray.push(
          recentTdee.reduce((acc, val) => acc + val) / recentTdee.length
        );
      }
    }
  }

  return tdeeArray[weekNum - 1];
}

// @route   GET api/tdee
// @desc    calculate tdee on particular week formatted YYYY-MM-DD
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const resultSet = await queryPromise(
      "SELECT * FROM data_entry WHERE userId = ? ORDER BY day ASC",
      [req.user.id]
    );
    const [year, month, day] = req.body.date.split("-");
    const date = new Date(year, month - 1, day);

    const startDate = resultSet[0].entryDate;
    const weekNum = Math.ceil((date - startDate) / (24 * 60 * 60 * 1000) / 7);
    const tdee = weeklyTDEE(weekNum, resultSet);

    res.json({ tdee });
  } catch (err) {
    throw err;
    res.status(500).send("Server Error");
  }
});

module.exports = router;
