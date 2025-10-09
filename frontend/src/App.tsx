import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import Home from "./components/Home/Home";
import PetsEvents from "./components/PetsEvents/PetsEvents";
import { AppProvider } from "./AppContext";

function App() {
  return (
    <AppProvider>
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pets-events" element={<PetsEvents />} />
      </Routes>
    </AppProvider>
  );
}

export default App