import { render, screen, fireEvent } from "@testing-library/react";
import { AuthContext, User } from "../../context/AuthContext";
import NavBar from "./NavBar";
import { MemoryRouter } from "react-router-dom";

const renderWithUser = (user: User | null, login = jest.fn(), logout = jest.fn(), setUser = jest.fn()) => {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={{user, login, logout, setUser}}>
        <NavBar />
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

describe("NavBar Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("should show Login and Register buttons when user is null", () => {
    renderWithUser(null);

    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
    expect(screen.queryByText(/Logout/i)).toBeNull();
  });

  test("should show welcome message and logout button when user is logged in", () => {
    const mockUser: User = {username: "testuser", token: "testtoken", isAdmin: false};
    renderWithUser(mockUser);

    expect(screen.getByText(/Hello, testuser!/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  test("should call logout and clears localStorage on logout", () => {
    const mockUser: User = {username: "testuser", token: "testtoken", isAdmin: true};
    const mockLogout = jest.fn();

    localStorage.setItem("token", mockUser.token);
    localStorage.setItem("username", mockUser.username);
    localStorage.setItem("isAdmin", JSON.stringify(mockUser.isAdmin));

    renderWithUser(mockUser, undefined, mockLogout);

    const logoutButton = screen.getByText(/Logout/i);
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
  });
});