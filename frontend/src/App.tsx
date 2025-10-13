import { APIProvider } from '@vis.gl/react-google-maps';
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home';
import PetPage from './components/Pet/PetPage';
import EventPage from './components/Event/EventPage';
import NavBar from "./components/NavBar/NavBar";
import { AuthProvider } from "./context/AuthContext";
import PetsEvents from './components/PetsEvents/PetsEvents';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <AuthProvider>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pets-events" element={<PetsEvents />} />
        <Route path="/pets/:id" element={<PetPage />} />
        <Route path="/events/:id" element={<EventPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;