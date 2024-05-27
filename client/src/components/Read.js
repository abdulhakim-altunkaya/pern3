import React, {useEffect, useState} from 'react';
import axios from "axios";
import '../table.css';

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
    <div className='tableDiv'>
      <br/> <br/> <br/>
      <button onClick={fetchData} className='buttons1'> Fetch Data</button> <br/> <br/>
      {sentences.length > 0 ? 
        (sentences.map( record => (
          <table className='tableArea'>
            <tr>
              <th className='tableTitles'>Sentence English</th>
              <th className='tableTitles'>Sentence Portuguese</th>
            </tr>
            <tr className='tableEntries' key={record.id}>
              <td>{record.sentenceeng}</td>
              <td>{record.sentencepor}</td>
            </tr>
          </table>

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