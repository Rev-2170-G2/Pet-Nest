import { useState } from 'react'
import { APIProvider, Map } from '@vis.gl/react-google-maps';

import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <>
    <APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY}>
    <Routes>
      <Route path='/' element={<Home/>}></Route>
    </Routes>
    </APIProvider>
    </>
  )
}

export default App
