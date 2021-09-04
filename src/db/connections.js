const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "testuser",
  password: "password",
  database: "tdeedb",
  timezone: "UTC",
});
console.log("MYSQL pool created...");

const queryPromise = async (query, param) => {
  const rows = await new Promise((resolve, reject) => {
    pool.query(query, param, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
  return rows;
};

module.exports = { pool, queryPromise };
