import React from 'react'
import { useParams } from 'react-router-dom'

import { useEffect, useMemo, useState } from 'react'

import {io} from "socket.io-client"

export const Ground = () => {

    const {id} = useParams();
    console.log(id);

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

      socket.on("loaded", ({rootContent})=>{
        console.log(rootContent)
      })
  
      
      
  
    }, [])

    const loaderHandler = () =>{
      console.log("calling");
      
    }


  return (
    <div>
      
      <button onClick={loaderHandler} >loader</button>

    </div>
  )
}
