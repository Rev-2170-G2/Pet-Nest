import { render, screen, fireEvent } from "@testing-library/react";
import { AuthContext, User } from "../../context/AuthContext";
import NavBar from "./NavBar";
import { MemoryRouter } from "react-router-dom";

describe("NavBar Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("should show Login and Register buttons when user is null", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{user: null, login: jest.fn(), logout: jest.fn(), setUser: jest.fn()}}>
          <NavBar />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
    expect(screen.queryByText(/Logout/i)).toBeNull();
  });

  test("should show welcome message and logout button when user is logged in", () => {
    const mockUser: User = {username: "testuser", token: "testtoken", isAdmin: false};
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{user: mockUser, login: jest.fn(), logout: jest.fn(), setUser: jest.fn()}}>
          <NavBar />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Hello, testuser!/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  test("should call logout and clears localStorage on logout", () => {
    const mockUser: User = {username: "testuser", token: "testtoken", isAdmin: true};
    const mockLogout = jest.fn();

    localStorage.setItem("token", mockUser.token);
    localStorage.setItem("username", mockUser.username);
    localStorage.setItem("isAdmin", JSON.stringify(mockUser.isAdmin));

    render(
      <MemoryRouter>
        <AuthContext.Provider value={{user: mockUser, login: jest.fn(), logout: mockLogout, setUser: jest.fn()}}>
          <NavBar />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Logout/i));
    expect(mockLogout).toHaveBeenCalled();
  });
});