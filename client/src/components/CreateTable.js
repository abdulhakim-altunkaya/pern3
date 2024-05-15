import React, {useState} from 'react';
import axios from "axios";

function CreateTable() {
  const [message, setMessage] = useState("");

  const createTable = async () => {
    try {
      const response = await axios.get("http://localhost:5000/servercreatetable");
      const myData = response.data.myMessage;
      setMessage(myData);
    } catch (error) {
      setMessage("Frontend: error while creating table: " + error.message);
    }
  }

  return (
    <div>
      <br/><br/><br/><br/><br/>
      <button className="buttons1" onClick={createTable}>Create Table</button>
      <br/><br/>
      {message}
    </div>
  )
}

export default CreateTable