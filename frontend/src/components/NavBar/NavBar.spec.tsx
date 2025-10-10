import { render, screen, fireEvent } from "@testing-library/react";
import { UserContext, User } from "../../context/AppContext";
import NavBar from "./NavBar";
import { MemoryRouter } from "react-router-dom";

const renderWithUser = (user: User | null, setUser: (user: User | null) => void) => {
  return render(
    <MemoryRouter>
      <UserContext.Provider value={{user, setUser}}>
        <NavBar />
      </UserContext.Provider>
    </MemoryRouter>
  );
};

describe("NavBar Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("should show Login and Register buttons when user is null", () => {
    const mockSetUser = jest.fn();
    renderWithUser(null, mockSetUser);

    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
    expect(screen.queryByText(/Logout/i)).toBeNull();
  });

  test("should show welcome message and logout button when user is logged in", () => {
    const mockUser: User = {username: "testuser", token: "testtoken"};
    const mockSetUser = jest.fn((user) => {
      if (!user) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
      }
    });

    localStorage.setItem("token", mockUser.token);
    localStorage.setItem("username", mockUser.username);

    renderWithUser(mockUser, mockSetUser);

    expect(screen.getByText(/Hello, testuser!/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  test("should call setUser(null) and removes token from localStorage on logout", () => {
    const mockUser: User = {username: "testuser", token: "testtoken"};
    const mockSetUser = jest.fn((user) => {
      if (!user) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
      }
    });

    localStorage.setItem("token", mockUser.token);
    localStorage.setItem("username", mockUser.username);

    renderWithUser(mockUser, mockSetUser);

    const logoutButton = screen.getByText(/Logout/i);
    fireEvent.click(logoutButton);

    expect(mockSetUser).toHaveBeenCalledWith(null);
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("username")).toBeNull();
  });
});
