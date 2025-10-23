import { render, screen, fireEvent } from "@testing-library/react";
import PetDetails from "./PetDetails";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../context/AuthContext", () => ({
  useAuth: () => ({user: null})
}));

const mockPet = {
  PK: "owner1",
  id: "pet1",
  entity: "PET",
  name: "Fufu",
  type: "Cat",
  location: "NYC",
  eventsCompleted: 3,
  review: [{ createdAt: 'just now', rating: 5, reviewText: 'wow so great'}],
  description: "Crazy cat",
  photos: ["https://example.com/fufu.jpg"],
  services: [{service: "Model", price: 20}]
};

test("Show pet details", () => {
  render(
    <MemoryRouter>
      <PetDetails pet={mockPet}/>
    </MemoryRouter>
  );
  expect(screen.getByText("Fufu")).toBeInTheDocument();
  expect(screen.getByText("Cat")).toBeInTheDocument();
  expect(screen.getByText("3 events completed")).toBeInTheDocument();
  expect(screen.getByText("Crazy cat")).toBeInTheDocument();
  expect(screen.getByText("Model")).toBeInTheDocument();
});

test("Show warning when user is not logged in", () => {
  render(
    <MemoryRouter>
      <PetDetails pet={mockPet}/>
    </MemoryRouter>
  );
  fireEvent.click(screen.getByText(/Request Service/i));
  expect(screen.getByText(/You must be logged in/i)).toBeInTheDocument();
});