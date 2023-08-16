const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();

app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'your_db_user',
  password: 'your_db_password',
  database: 'advice_app'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to the database');
});

// Create
app.post('/advice', (req, res) => {
  const { text } = req.body;
  const insertQuery = 'INSERT INTO advice (text) VALUES (?)';
  
  db.query(insertQuery, [text], (err, result) => {
    if (err) {
      console.error('Insert failed:', err);
      res.status(500).json({ error: 'Insert failed' });
      return;
    }
    res.status(201).json({ id: result.insertId });
  });
});

// Read
app.get('/advice', (req, res) => {
  const selectQuery = 'SELECT * FROM advice';
  
  db.query(selectQuery, (err, results) => {
    if (err) {
      console.error('Select failed:', err);
      res.status(500).json({ error: 'Select failed' });
      return;
    }
    res.json(results);
  });
});

// Update
app.put('/advice/:id', (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const updateQuery = 'UPDATE advice SET text = ? WHERE id = ?';
  
  db.query(updateQuery, [text, id], (err, result) => {
    if (err) {
      console.error('Update failed:', err);
      res.status(500).json({ error: 'Update failed' });
      return;
    }
    res.json({ message: 'Update successful' });
  });
});

// Delete
app.delete('/advice/:id', (req, res) => {
  const { id } = req.params;
  const deleteQuery = 'DELETE FROM advice WHERE id = ?';
  
  db.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error('Delete failed:', err);
      res.status(500).json({ error: 'Delete failed' });
      return;
    }
    res.json({ message: 'Delete successful' });
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
