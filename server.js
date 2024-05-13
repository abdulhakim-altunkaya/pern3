





const express = require("express");
const app = express();

const { supabase, pool } = require('./db'); // Import the connection

//we need cors middleware because frontend and backend run on different ports
const cors = require("cors");
app.use(cors());

//Take json data in req.body and converts it into JS object so that our backend can work with it. 
//For now, we dont have req.body but we might use it. 
//extended false means dont deal with anything more advanced than basic objects and arrays
app.use(express.json({extended: false}))

app.get("/readfromserver", (req, res) => {
  res.json({myMessage: "Hey from server"});
})

app.get("/servercreatetable", async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS aufgaben (
        id SERIAL PRIMARY KEY,
        description TEXT
      )
    `);
    console.log("table created successfully");
  } catch (error) {
    console.log(error.message);
  } finally {
    client.release();
  }
});

app.post("/serveraddtask", async (req, res) => {
  const { myTask } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO aufgaben (description) VALUES ($1) RETURNING *`,
      [myTask]
    );
    client.release();
    console.log("Task added successully", result.rows[0]);
    res.status(201).send('Task added successfully');
  } catch (error) {
    console.log(error.message);
  }
});


app.get("/servergettasks", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT * FROM aufgaben'
    );
    client.release(); // Release the client connection
    const dbTasks = result.rows; // Extract tasks from the query result
    res.status(200).json(dbTasks); // Send tasks to the client
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    res.status(500).send('Error fetching tasks'); // Send error response to client
  }
});

app.post("/serverdeletetask", async (req, res) => {
  const { taskId } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query(
      `DELETE FROM aufgaben WHERE id = $1`,
      [taskId]
    );
    /* Step 2: Reorder the IDs
    This is not useful. Because each id is a one time use.
    For example if there is 5 records and I delete record Number 5,
    Then If I save another record it will have record number 6 not 5. 
    await client.query(`
      UPDATE aufgaben
      SET id = id - 1
      WHERE id > $1
    `, [taskId]);
    */
    client.release();
    res.status(200).send("Task deleted successfully");
  } catch (error) {
    console.error('Error deleting task:', error.message);
    res.status(500).send('Error deleting task'); // Send error response to client
  }
});

app.post("/serverupdatetask", async (req, res) => {
  const {taskText, taskId} = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query(
      `UPDATE aufgaben SET description = $1 WHERE id = $2`,
      [taskText, taskId]
    )
    client.release();
    res.status(200).send("Task updated successfully");
    
  } catch (error) {
    console.error('Server Error updating task:', error.message);
    res.status(500).send('Server Error updating task'); // Send error response to client
  }
})

const PORT = process.env.PORT ||5000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});