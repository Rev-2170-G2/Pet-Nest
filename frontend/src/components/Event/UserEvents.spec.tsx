import {render, screen, waitFor} from "@testing-library/react";
import UserEvents from "./UserEvents";
import {MemoryRouter} from "react-router-dom";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

test("Show other user events and navigates on click", async () => {
  const mockEvents = [
    {id: "event1", PK: "user1", entity: "EVENT", name: "Event One", date: "2025-10-16", location: "Park", description: "Desc", photos: "img.jpg", approved: true},
    {id: "event2", PK: "user1", entity: "EVENT", name: "Event Two", date: "2025-10-16", location: "Beach", description: "Desc", photos: "img.jpg", approved: true}
  ];

  mockedAxios.get.mockResolvedValue({data: {data: mockEvents}});

  render(
    <MemoryRouter>
      <UserEvents userId="user1" excludeEventId="event2"/>
    </MemoryRouter>
  );

  await waitFor(() =>
    expect(screen.getByText("More events from this organizer")).toBeInTheDocument()
  );

  await waitFor(() =>
    expect(screen.getByText("Event One")).toBeInTheDocument()
  );

  expect(screen.queryByText("Event Two")).not.toBeInTheDocument();
});