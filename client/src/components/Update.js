import React, {useState} from 'react'
import axios from "axios";

function Update() {

  const [englishValue, setEnglishValue] = useState("");
  const [portugueseValue, setPortugueseValue] = useState("");
  const [targetId1, setTargetId1] = useState("");

  const [message, setMessage] = useState("");

  const handleUpdate = async () => {
    try {
      const response = await axios.post("http://localhost:5000/serverupdatesentence", 
        {senEng: englishValue, senPor: portugueseValue, targetId2: targetId1});
      setMessage(response.data.myMessage)
    } catch (error) {
      console.log("Error Frontend: ", error.message);
    }
    
  }

  return (
    <div>
      <input type='text' className='inputArea' placeholder='enter English Text'
        value={englishValue} onChange={e => setEnglishValue(e.target.value)} /> {"      "}{"      "}
      <input type='text' className='inputArea' placeholder='enter Portuguese Text'
        value={portugueseValue} onChange={e => setPortugueseValue(e.target.value)} />{"      "}{"      "}
      <input type='number' className='inputArea' placeholder='sentence id'
        value={targetId1} onChange={e => setTargetId1(e.target.value)} /> <br/> <br/>
      <button onClick={handleUpdate} className='buttons1'>SAVE</button>  <br/> <br/>
      {message}
    </div>
  )
}

export default Update;