import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import EventDetails from "./EventDetails";
import {MemoryRouter} from "react-router-dom";
import axios from "axios";

jest.mock("../../context/AuthContext", () => ({
  useAuth: () => ({user: null})
}));

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("../Offers/Events/EventOfferModal", () => ({open}: any) => <div>EventOfferModal {open ? "open" : "closed"}</div>);

const mockEvent = {
  PK: "user1",
  id: "event1",
  entity: "EVENT",
  name: "Park Event",
  date: "2025-10-16",
  location: "Park",
  description: "Park gathering",
  photos: "something.com",
  approved: true
};

test("Shows event details", async () => {
  mockedAxios.get.mockResolvedValue({data: {data: []}});

  render(
    <MemoryRouter>
      <EventDetails event={mockEvent}/>
    </MemoryRouter>
  );

  await waitFor(() => expect(screen.getByText("Park Event")).toBeInTheDocument());
  expect(screen.getByText("Park gathering")).toBeInTheDocument();
  expect(screen.getByText("Join Event")).toBeInTheDocument();
});

test("Shows warning when user not logged in", async () => {
  mockedAxios.get.mockResolvedValue({data: {data: []}});

  render(
    <MemoryRouter>
      <EventDetails event={mockEvent}/>
    </MemoryRouter>
  );

  fireEvent.click(screen.getByText(/Join Event/i));
  await waitFor(() => expect(screen.getByText(/You must be logged in/i)).toBeInTheDocument());
});