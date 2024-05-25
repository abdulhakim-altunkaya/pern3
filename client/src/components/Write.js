import React, {useState} from 'react'
import axios from "axios";

function Write() {

  const [englishValue, setEnglishValue] = useState("");
  const [portugueseValue, setPortugueseValue] = useState("");
  const [message, setMessage] = useState("");

  const saveData = async () => {
    try {
      const response = await axios.post("http://localhost:5000/serversavesentences", {senEng: englishValue, senPor: portugueseValue});
      setMessage(response.data.myMessage)
    } catch (error) {
      setMessage("Error Frontend: ", error.message);

    }
    
  }

  return (
    <div>
      <input type='text' className='inputArea' placeholder='enter English Text'
        value={englishValue} onChange={e => setEnglishValue(e.target.value)} /> {"      "}{"      "}
      <input type='text' className='inputArea' placeholder='enter Portuguese Text'
        value={portugueseValue} onChange={e => setPortugueseValue(e.target.value)} /> <br/> <br/>
      <button onClick={saveData} className='buttons1'>SAVE</button>  <br/> <br/>
      {message}
    </div>
  )
}

export default Write;