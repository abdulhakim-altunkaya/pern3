const express = require("express");
const app = express();

const { pool } = require("./db"); //database connection

//we need this middleware because frontend and backend run on different ports
const cors = require("cors");
app.use(cors());

//express.json takes json data inside req.body and converts it into js object so that we can use it here.
//We will probably send data from frontend to backend that
app.use(express.json({extended: false}));

app.get("/serversendhello", (req, res) => {
  res.json({myMessage: "Hey from the server"});
});

app.get("/servercreatetable", async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      CREATE TABLE IF NOT EXISTS gedanken (
        id SERIAL PRIMARY KEY,
        sentenceEng TEXT,
        sentencePor TEXT
      )
    `);
    if (result.command === 'CREATE') {
      console.log("The 'gedanken' table was created.");
      res.status(200).json({myMessage: "The 'gedanken' table created" });
    } else {
      console.log("The 'gedanken' table already exists.");
      res.status(409).json({myMessage: "The 'gedanken' table already exists" });
    }
  } catch (error) {
    console.log("Error-Backend-servercreatetable route: " + error.message);
    res.status(409).json({myMessage: "The 'gedanken' table creation failed, connection to database failed" });
  } finally {
    client.release();
  }
});

app.post("/serveraddsentences", async () => {
  const { senEng, senPor } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query(
    `INSERT INTO gedanken (senEng, senPor) VALUES ($1, $2) RETURNING *`,
    [senEng, senPor]
    );
    client.release();
    res.status(201).json({ myMessage: "SERVER: Sentences successfully saved"});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ myMessage: "SERVER: failed attempt at saving sentences. Probably connection to database failed"});
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on PORT: ${PORT}`);
})

/*

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
    *//*
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
*/