import { Routes, Route } from 'react-router-dom'
import './App.css'
import { Ground } from './components/Ground'

import  Homepage  from './components/Homepage'



function App() {







  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path='/ground/:id' element={<Ground />} />
    </Routes>
  )
}

export default App
