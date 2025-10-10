import { Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import './App.css';

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>}></Route>
    </Routes>
    </>
  )
}

export default App;
