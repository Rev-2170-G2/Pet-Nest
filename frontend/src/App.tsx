import { Route, Routes } from 'react-router-dom';
import NavBar from "./components/NavBar/NavBar";
import Home from './components/Home/Home';
import PetPage from './components/Pet/PetPage';
import EventPage from './components/Event/EventPage';
import { AuthProvider } from "./context/AuthContext";
import PetsEvents from './components/PetsEvents/PetsEvents';
import Offers from './components/Offers/Offers';

function App() {
  return (
    <AuthProvider>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pets-events" element={<PetsEvents />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/pets/:id" element={<PetPage />} />
        <Route path="/events/:id" element={<EventPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;