import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import path from 'path';

const app = express();
// Use 3001 by default to avoid clashing with the Angular dev server on 3000.
const port = process.env.PORT || 3001;

// Database setup
// Logic: If the current working directory ends with 'server', we are already inside it.
// Otherwise, assume we are at the project root and need to look into the 'server' folder.
const isRunningInServerDir = process.cwd().endsWith('server');
const dbPath = isRunningInServerDir 
  ? path.join(process.cwd(), 'database.db') 
  : path.join(process.cwd(), 'server', 'database.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database at ' + dbPath, err.message);
  } else {
    console.log('Connected to the SQLite database at ' + dbPath);
    db.run(`CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error creating table', err.message);
      } else {
        console.log('Contacts table is ready.');
      }
    });
  }
});

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
// Fix: Cast express.json() to 'any' to resolve potential 'NextHandleFunction' vs 'PathParams' overload mismatch in some TS environments.
app.use(express.json() as any); 

// API Route for contact form
// Fix: Use 'any' casting for req and res to bypass strict type checking issues where 'body' or 'status' might be missing from the inferred types.
app.post('/api/contact', (req: express.Request, res: express.Response) => {
  const { name, email, message } = (req as any).body;

  console.log('--- New Contact Form Submission ---');
  console.log(`Name: ${name}`);
  console.log(`Email: ${email}`);
  console.log(`Message: ${message}`);
  console.log('------------------------------------');

  // Basic validation
  if (!name || !email || !message) {
    return (res as any).status(400).json({ error: 'All fields are required.' });
  }

  // Insert data into the database
  const sql = `INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)`;
  db.run(sql, [name, email, message], function (err) {
    if (err) {
      console.error('Database error on insert', err.message);
      return (res as any).status(500).json({ error: 'Failed to save message.' });
    }
    console.log(`A new contact has been added with ID: ${this.lastID}`);
    (res as any).status(200).json({ success: true, message: 'Message received successfully!' });
  });
});

// GET Route to retrieve contact messages (Admin)
app.get('/api/contact', (req: express.Request, res: express.Response) => {
  const sql = "SELECT * FROM contacts ORDER BY submitted_at DESC";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return (res as any).status(400).json({ "error": err.message });
    }
    (res as any).status(200).json({
      "message": "success",
      "data": rows
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});