const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "testuser",
  password: "password",
  database: "tdeedb",
});
console.log("mysql pool created");
module.exports = pool;
