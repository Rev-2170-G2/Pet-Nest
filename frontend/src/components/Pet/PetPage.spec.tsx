import {render, screen, waitFor, fireEvent} from "@testing-library/react";
import PetPage from "./PetPage";
import {MemoryRouter, Route, Routes} from "react-router-dom";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("./PetDetails", () => ({pet}: any) => <div>{pet.name}</div>);
jest.mock("./UserPets", () => () => <div>UserPets Component</div>);

test("Shows loading and pet details", async () => {
  mockedAxios.get.mockResolvedValue({data: {data: [{id: "1", PK: "p1", entity: "PET", name: "Fufu"}]}});

  render(
    <MemoryRouter initialEntries={["/pets/1"]}>
      <Routes>
        <Route path="/pets/:id" element={<PetPage/>}/>
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/Page is loading/i)).toBeInTheDocument();
  await waitFor(() => expect(screen.getByText("Fufu")).toBeInTheDocument());
  expect(screen.getByText("UserPets Component")).toBeInTheDocument();
});

test("Shows pet not found", async () => {
  mockedAxios.get.mockResolvedValue({data: {data: []}});

  render(
    <MemoryRouter initialEntries={["/pets/2"]}>
      <Routes>
        <Route path="/pets/:id" element={<PetPage/>}/>
      </Routes>
    </MemoryRouter>
  );

  await waitFor(() => expect(screen.getByText(/Pet not found/i)).toBeInTheDocument());
  fireEvent.click(screen.getByText(/Go Home/i));
});