import { useRef } from "react";
import { APIProvider } from '@vis.gl/react-google-maps';
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home';
import PetPage from './components/Pet/PetPage';
import EventPage from './components/Event/EventPage';
import NavBar from "./components/NavBar/NavBar";
import { AuthProvider } from "./context/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import PetForm from "./components/PetForm/PetForm";
import EventForm from "./components/EventForm/EventForm";
import Footer from "./components/Footer/Footer";
import About from "./pages/About/About";
import Terms from "./pages/Terms/Terms";
import ScrollToTop from "./components/ScrollToTop";
import Admin from "./components/Admin/Admin";
import Profile from "./pages/Profile/Profile";
import ThemeProviderComponent from './components/ThemeProviderComponent';

import './style.css';

function App() {
  const joinRef = useRef<HTMLDivElement | null>(null);

  const scrollToJoin = () => {
    if (joinRef.current) {
      const navbarHeight = 70;
      const elementY =
        joinRef.current.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top: elementY, behavior: "smooth" });
    }
  };

  return (
    <ThemeProviderComponent>
      <AuthProvider>
        <NavBar onJoinClick={scrollToJoin} />
        <APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY}>
          <ScrollToTop />
          <main>
            <Routes>
              <Route path="/" element={<Home joinRef={joinRef} />} />
              <Route path="/pets/:id" element={<PetPage />} />
              <Route path="/events/:id" element={<EventPage />} />
              <Route path="/pet-form" element={<PetForm />} />
              <Route path="/event-form" element={<EventForm />} />
              <Route path="/about" element={<About />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <Footer />
        </APIProvider>
      </AuthProvider>
    </ThemeProviderComponent>
  );
}

export default App;