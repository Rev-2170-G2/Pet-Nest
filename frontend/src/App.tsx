import { useRef } from "react";
import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import Home from "./components/Home/Home";
import PetPage from "./components/Pet/PetPage";
import EventPage from "./components/Event/EventPage";
import { AuthProvider } from "./context/AuthContext";
import PetsEvents from "./components/PetsEvents/PetsEvents";
import "./App.css"

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
    <AuthProvider>
      <NavBar onJoinClick={scrollToJoin} />
      <Routes>
        <Route path="/" element={<Home joinRef={joinRef} />} />
        <Route path="/pets-events" element={<PetsEvents />} />
        <Route path="/pets/:id" element={<PetPage />} />
        <Route path="/events/:id" element={<EventPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;