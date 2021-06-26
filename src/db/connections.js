const mysql = require('mysql');

const createConnections = async () => {
  
}
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'testuser',
  password: 'password',
  database: 'tdeedb'
});

module.exports = pool;