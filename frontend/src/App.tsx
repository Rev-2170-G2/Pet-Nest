import { APIProvider } from '@vis.gl/react-google-maps';
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home';
import PetPage from './components/Pet/PetPage';
import EventPage from './components/Event/EventPage';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <>
    <APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY}>
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path="/pets/:id" element={<PetPage />} />
      <Route path="/events/:id" element={<EventPage />} />
    </Routes>
    </APIProvider>
    </>
  )
}

export default App;
