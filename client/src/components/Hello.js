import React, {useState, useEffect} from 'react';
import axios from "axios";

function Hello() {

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/serversendhello");
        const myData = response.data.myMessage;
        setMessage(myData);
      } catch (error) {
        setMessage("Frontend: Error while connecting backend ", )
      }
    }
    fetchData();
  }, []);
  
  return (
    <div>{message}</div>
  )

}

export default Hello;