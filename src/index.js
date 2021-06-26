const express = require('express');
const pool = require('./db/connections');

const app = express();

app.use(express.json({extended : false}));
// Routes
app.use('/api/users', require('./api/users'));
app.use('/api/auth', require('./api/auth'));


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Server up on port ' + port);
})


pool.query('select * from movies limit 1', (err, rows) => {
    if(err) throw err;
    console.log('data:');
    console.log(rows);
})