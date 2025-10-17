import {render, screen, waitFor, fireEvent} from "@testing-library/react";
import EventPage from "./EventPage";
import {MemoryRouter, Route, Routes} from "react-router-dom";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("./EventDetails", () => ({event}: any) => <div>{event.name}</div>);
jest.mock("./UserEvents", () => () => <div>UserEvents Component</div>);

test("Shows loading and event details", async () => {
  mockedAxios.get.mockResolvedValue({
    data: {data: [{id: "1", PK: "e1", entity: "EVENT", name: "Fun Event"}]}
  });

  render(
    <MemoryRouter initialEntries={["/events/1"]}>
      <Routes>
        <Route path="/events/:id" element={<EventPage/>}/>
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/Page is loading/i)).toBeInTheDocument();
  await waitFor(() => expect(screen.getByText("Fun Event")).toBeInTheDocument());
  expect(screen.getByText("UserEvents Component")).toBeInTheDocument();
});

test("Shows event not found", async () => {
  mockedAxios.get.mockResolvedValue({data: {data: []}});

  render(
    <MemoryRouter initialEntries={["/events/2"]}>
      <Routes>
        <Route path="/events/:id" element={<EventPage/>}/>
        <Route path="/" element={<div>Home Page</div>} />
      </Routes>
    </MemoryRouter>
  );

  await waitFor(() => expect(screen.getByText(/Event not found/i)).toBeInTheDocument());
  fireEvent.click(screen.getByText(/Go Home/i));
  expect(screen.getByText("Home Page")).toBeInTheDocument();
});