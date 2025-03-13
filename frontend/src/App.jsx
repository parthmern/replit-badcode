import { Routes, Route } from 'react-router-dom'
import './App.css'
import { Ground } from './components/Ground'

import  Homepage  from './components/Homepage'
import { useEffect, useMemo, useState } from 'react'

import {io} from "socket.io-client"


function App() {

  const [socketId, setSocketId] = useState();
  
  const socket = useMemo(()=>{
    return io("http://localhost:4000", {
      query: {
        roomId: "123"
    }
    })
  }, [])



  useEffect(()=>{

    socket.on("connect", ()=>{
      console.log("connected with id", socket.id);
      setSocketId(socket.id);
    })


  }, [])

  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path='/ground/:id' element={<Ground />} />
    </Routes>
  )
}

export default App
