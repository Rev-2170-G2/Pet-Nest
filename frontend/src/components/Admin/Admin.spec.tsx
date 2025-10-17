import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Admin from "./Admin";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("../../context/AuthContext", () => ({
  useAuth: () => ({user: {token: "token"}})
}));

test("Show events and filters it out on approve click", async () => {
  mockedAxios.get.mockResolvedValue({data: {data: [{id: "1", name: "Event", approved: null, location: "NY", description: "something", photos: ""}]}});
  mockedAxios.patch.mockResolvedValue({}); //act like axios patch worked

  render(<Admin/>);

  await waitFor(() => screen.getByText("Event"));
  fireEvent.click(screen.getByText(/Approve/i)); //i = case in-sensitive
  await waitFor(() => expect(screen.queryByText("Event")).toBeNull());
});

test("Show events and filters it out on deny click", async () => {
  mockedAxios.get.mockResolvedValue({data: {data: [{id: "1", name: "Event", approved: null, location: "NY", description: "something", photos: ""}]}});
  mockedAxios.patch.mockResolvedValue({}); //act like axios patch worked

  render(<Admin/>);

  await waitFor(() => screen.getByText("Event"));
  fireEvent.click(screen.getByText(/Deny/i)); //i = case in-sensitive
  await waitFor(() => expect(screen.queryByText("Event")).toBeNull());
});

test("No events awaiting approval when empty", async () => {
  mockedAxios.get.mockResolvedValue({data: {data: []}});

  render(<Admin/>);

  await waitFor(() =>expect(screen.getByText(/No events awaiting approval/i)).toBeInTheDocument());
});