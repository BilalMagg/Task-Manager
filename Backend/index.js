require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = 5000; // Backend will run on this port

// Middleware
app.use(cors());
app.use(express.json()); // Allows reading JSON from requests

// Database connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// Test API Route
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Add a new task
app.post("/tasks", async (req, res) => {
  try {
    const { title, deadline } = req.body;
    const result = await pool.query(
      "INSERT INTO tasks (title,deadline) VALUES ($1,$2) RETURNING *",
      [title,deadline]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Modify an existing task
app.put("/tasks/:id", async (req, res)=> {
  try {
    const { id } = req.params;
    const { title, deadline, completed } = req.body;
    await pool.query("UPDATE tasks SET title = $1, completed = $2, deadline = $3 WHERE id = $2", [title,completed,deadline, id]);
    res.json({message:"Task updated"});
  } catch (err) {
    console.error(err.message);
  }
});

// Delete a task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    res.json({ message: "Task deleted!" });
  } catch (err) {
    console.error(err.message);
  }
});

// Checking methods handled by this API
app.options('/tasks', (req, res) => {
  res.setHeader('Allow', 'GET, POST, PUT, DELETE');
  res.status(200).end(); // Respond with a 200 OK and allowed methods in the header
});

app.get('/status', async (req, res) => {
  try {
      await pool.query('SELECT 1');
      res.json({ status: 'Database is online' });
  } catch (error) {
      res.status(500).json({ status: 'Database is offline' });
  }
});