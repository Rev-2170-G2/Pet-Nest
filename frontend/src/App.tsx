import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home/Home';
import './App.css'
import NavBar from './components/NavBar/NavBar';

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <NavBar />

      <Routes>
        <Route path='/' element={<Home />}></Route>
        {/* <Route path='/' element={<Home />}></Route>
        <Route path='/' element={<Home />}></Route>
        <Route path='/' element={<Home />}></Route> */}
      </Routes>
      {/* <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  )
}

export default App
