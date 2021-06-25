const mysql = require('mysql');

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'mytestuser',
  password: 'My6$Password',
  database: 'moviedb'
});

conn.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});

conn.query('select * from movies limit 10', (err, rows) => {
    if(err) throw err;
    console.log('data:');
    console.log(rows);
})