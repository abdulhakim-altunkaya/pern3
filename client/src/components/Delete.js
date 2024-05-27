import React, {useState} from 'react'
import axios from "axios";

function Delete() {
  const [inputNum, setInputNum] = useState("");
  const [message, setMessage] = useState("");


  const deleteSentence = async () => {
    try {
      const response = await axios.post("http://localhost:5000/serverdeletesentence", {targetSentence: inputNum});
      setMessage(response.data.myMessage);
    } catch (error) {
      console.log(error.message)
    }
  }
  return (
    <div>
      <br/><br/>
      <input type='number' className='inputArea' 
        value={inputNum} onChange={e => setInputNum(e.target.value)} />
      {"     "}
      <button className='buttons1' onClick={deleteSentence} >DELETE</button>
      <br/><br/>
      {message}
    </div>
  )
}

export default Delete