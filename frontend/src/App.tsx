import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>}></Route>
    </Routes>
    </>
  )
}

export default App
