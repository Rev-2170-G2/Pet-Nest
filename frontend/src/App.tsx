import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import Home from "./components/Home/Home";
import PetsEvents from "./components/PetsEvents/PetsEvents";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pets-events" element={<PetsEvents />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;