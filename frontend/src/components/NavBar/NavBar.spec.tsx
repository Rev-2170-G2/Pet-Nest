import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { AuthContext, User } from "../../context/AuthContext";
import NavBar from "./NavBar";
import { MemoryRouter } from "react-router-dom";

jest.mock("../Auth/Login/Login", () => ({ onClose }: any) => (
  <div>
    Login Modal
    <button onClick={onClose}>Close</button>
  </div>
));
jest.mock("../Auth/Register/Register", () => ({ onClose, onSwitchToLogin }: any) => (
  <div>
    Register Modal
    <button onClick={onClose}>Close</button>
    <button onClick={onSwitchToLogin}>Switch to Login</button>
  </div>
));

describe("NavBar Component", () => {
  beforeAll(() => {
    Object.defineProperty(window, "scrollTo", { value: jest.fn(), writable: true });
  });

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  test("should show Login and Register buttons when user is null", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: null, login: jest.fn(), logout: jest.fn(), setUser: jest.fn() }}>
          <NavBar />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
    expect(screen.queryByText(/Logout/i)).toBeNull();
  });

  test("should show welcome message and logout button when user is logged in", () => {
    const mockUser: User = { id: "abc123", username: "testuser", token: "testtoken", admin: false };
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: mockUser, login: jest.fn(), logout: jest.fn(), setUser: jest.fn() }}>
          <NavBar />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Hello, testuser!/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  test("should show admin link only for admin users", () => {
    const adminUser: User = { id: "abc123", username: "adminuser", token: "admintoken", admin: true };
    const normalUser: User = { id: "abc123", username: "normaluser", token: "normaltoken", admin: false };

    const { unmount } = render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: adminUser, login: jest.fn(), logout: jest.fn(), setUser: jest.fn() }}>
          <NavBar />
        </AuthContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();

    unmount();
    cleanup();

    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: normalUser, login: jest.fn(), logout: jest.fn(), setUser: jest.fn() }}>
          <NavBar />
        </AuthContext.Provider>
      </MemoryRouter>
    );
    expect(screen.queryByText(/Admin Dashboard/i)).toBeNull();
  });

  test("should open Login modal when clicking Login button", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: null, login: jest.fn(), logout: jest.fn(), setUser: jest.fn() }}>
          <NavBar />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Login/i));
    expect(screen.getByText(/Login Modal/i)).toBeInTheDocument();
  });

  test("should open Register modal and switches to Login modal", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: null, login: jest.fn(), logout: jest.fn(), setUser: jest.fn() }}>
          <NavBar />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Register/i));
    expect(screen.getByText(/Register Modal/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Switch to Login/i));
    expect(screen.getByText(/Login Modal/i)).toBeInTheDocument();
  });

  test("should call logout function when Logout button is clicked", () => {
    const mockLogout = jest.fn();
    const mockUser: User = { id: "abc123", username: "testuser", token: "testtoken", admin: false };
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: mockUser, login: jest.fn(), logout: mockLogout, setUser: jest.fn() }}>
          <NavBar />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Logout/i));
    expect(mockLogout).toHaveBeenCalled();
  });

  test("should call onJoinClick when Join is clicked on home page", () => {
    const mockJoin = jest.fn();
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AuthContext.Provider value={{ user: null, login: jest.fn(), logout: jest.fn(), setUser: jest.fn() }}>
          <NavBar onJoinClick={mockJoin} />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Join/i));
    expect(mockJoin).toHaveBeenCalled();
  });
});