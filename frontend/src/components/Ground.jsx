import React from 'react'
import { useParams } from 'react-router-dom'

export const Ground = () => {

    const {id} = useParams();
    console.log(id);

  return (
    <div>Ground</div>
  )
}
