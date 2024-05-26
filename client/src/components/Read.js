import React, {useEffect, useState} from 'react';
import axios from "axios";

function Read() {
  const [sentences, setSentences] = useState("");
  const [message, setMessage] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/servergetsentences")
      setSentences(response.data);
    } catch (error) {
      setMessage(error.message);
    }
  }
  return (
    <div>
      <br/> <br/> <br/>
      <button onClick={fetchData} className='buttons1'> Fetch Data</button> <br/> <br/>
      {sentences.length > 0 ? 
        (sentences.map( record => (
          <div key={record.id}>
            <span>{record.sentenceeng}</span> {"        "}
            <span>{record.sentencepor}</span>
          </div>
        )))
        : 
        <div>Database is Empty. Save Some sentences first.</div>
      } 
      <br/>
      {message}
    </div>
  )
}

export default Read