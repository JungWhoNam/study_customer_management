const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mysql = require('mysql');
const configuration = require('./config/keys');
const conn = mysql.createConnection(
  configuration.mysql.aws
);
conn.connect();

const multer = require('multer');
const upload = multer({ dest: './upload' });
app.use('/image', express.static('./upload'));

app.get('/api/customers', (req, res) => {
  conn.query(
    'SELECT * FROM CUSTOMER WHERE isDeleted=0',
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.post('/api/customers', upload.single('image'), (req, res, next) => {
  let sqlQuery = 'INSERT INTO CUSTOMER VALUES (null, ?, ?, ?, ?, ?, now(), 0)';
  conn.query(sqlQuery, [
    '/image/' + req.file.filename,
    req.body.name,
    req.body.birthday,
    req.body.gender,
    req.body.job
  ], (err, rows, fields) => {
    if (err) {
      throw err;
    }
    res.send(rows);
  });
});

app.delete('/api/customers/:id', (req, res) => {
  let sqlQuery = 'UPDATE CUSTOMER SET isDeleted=1 WHERE id=?';
  conn.query(sqlQuery, [req.params.id],
    (err, rows, fields) => {
      if (err) {
        throw err;
      }
      res.send(rows);
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`))