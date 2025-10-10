import { Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import PetPage from './components/Pet/PetPage';
import EventPage from './components/Event/EventPage';
import './App.css';

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path="/pets/:id" element={<PetPage />} />
      <Route path="/events/:id" element={<EventPage />} />
    </Routes>
    </>
  )
}

export default App;
