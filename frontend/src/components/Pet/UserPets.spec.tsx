import {render, screen, waitFor, fireEvent} from "@testing-library/react";
import UserPets from "./UserPets";
import {MemoryRouter} from "react-router-dom";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

test("Renders pets from user excluding current pet", async () => {
  mockedAxios.get.mockResolvedValue({
    data: {
      data: [
        {id: "1", PK: "p1", entity: "PET", name: "Fufu", description: "Friendly cat", location: "NYC"},
        {id: "2", PK: "p1", entity: "PET", name: "Mimi", description: "Friendly dog", location: "LA"}
      ]
    }
  });

  render(
    <MemoryRouter>
      <UserPets userId="p1" excludePetId="1" />
    </MemoryRouter>
  );

  await waitFor(() => expect(screen.getByText("Mimi")).toBeInTheDocument());
  expect(screen.queryByText("Fufu")).toBeNull();
  expect(screen.getByText("Friendly dog")).toBeInTheDocument();
  expect(screen.getByText("LA")).toBeInTheDocument();
});

test("Navigates to other pet page on click", async () => {
  mockedAxios.get.mockResolvedValue({
    data: {
      data: [{id: "2", PK: "p1", entity: "PET", name: "Mimi", description: "Friendly dog", location: "LA"}]
    }
  });

  render(
    <MemoryRouter>
      <UserPets userId="p1"/>
    </MemoryRouter>
  );

  await waitFor(() => expect(screen.getByText("Mimi")).toBeInTheDocument());
  fireEvent.click(screen.getByText("Mimi"));
});