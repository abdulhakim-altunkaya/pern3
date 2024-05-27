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

app.post("/serversavesentences", async (req, res) => {
  const {senEng, senPor} = req.body;
  try {
    const client = await pool.connect();
    await client.query(
      `INSERT INTO gedanken (sentenceeng, sentencepor) VALUES ($1, $2) RETURNING *`, [senEng, senPor]
    );
    client.release();
    res.status(201).json({myMessage: "Sentences saved successfully"});
  } catch (error) {
    res.status(500).json({myMessage: "Failure to save sentences to database"});
  }
});



app.get("/servergetsentences", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT * FROM gedanken`
    );
    client.release();
    const dbSentences = result.rows;
    res.status(200).json(dbSentences);
  } catch (error) {
    console.log(error.message);
    res.status(500);
  } 
});

app.post("/serverdeletesentence", async (req, res) => {
  const {targetSentence} = req.body;
  try {
    const client = await pool.connect();
    await client.query(
      `DELETE FROM gedanken WHERE id = $1`, [targetSentence]
    );
    client.release();
    res.status(201).json({myMessage: "Sentence deleted"});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({myMessage: "Backend: Error while deleting data"})
  }
})

app.post("/serverupdatesentence", async (req, res) => {
  const {senEng, senPor, targetId2} = req.body;
  try {
    const client = await pool.connect();
    await client.query(
      `UPDATE gedanken SET sentenceEng = $1, sentencePor = $2 WHERE id = $3`, [senEng, senPor, targetId2]
    );
    client.release();
    res.status(200).json({myMessage: "Sentence successfully updated"});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({myMessage: "Backend: Error while updating sentence. Check console"})
  }
})
/*    const result = await client.query(
      `UPDATE aufgaben SET description = $1 WHERE id = $2`,
      [taskText, taskId]
    )
*/

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on PORT: ${PORT}`);
})