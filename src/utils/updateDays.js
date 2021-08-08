const queryPromise = require("../db/connections");

const updateDays = async (id) => {
  const rows = await queryPromise(
    "SELECT * FROM data_entry WHERE userId = ? ORDER BY entryDate ASC",
    [id]
  );
  console.log(rows);
  console.log(rows[0].day - 1);
  await queryPromise("UPDATE data_entry SET day = day - ? WHERE userId = ? ", [
    rows[0].day - 1,
    id,
  ]);
};

module.exports = updateDays;
