import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home/Home';
import './App.css'
import PetPage from './components/PetPage/PetPage';

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path="/pets/:id" element={<PetPage />} />
      </Routes>
    </>
  )
}

export default App
