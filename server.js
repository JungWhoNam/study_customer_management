const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mysql = require('mysql');
const configuration = require('./config/keys');
const conn = mysql.createConnection(
  configuration.mysql.local
);
conn.connect();

app.get('/api/customers', (req, res) => {
  conn.query(
    'SELECT * FROM CUSTOMER',
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.listen(port, () => console.log(`Listening on port ${port}`))