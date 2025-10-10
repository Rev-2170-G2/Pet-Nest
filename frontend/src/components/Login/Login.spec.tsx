import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./Login";
import { AuthContext, User } from "../../context/AuthContext";

describe("Login Component", () => {
  const mockOnClose = jest.fn();
  const mockSubmit = jest.fn();
  const mockLogin = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockSubmit.mockClear();
    mockLogin.mockClear();
    (global as any).fetch = jest.fn();
  });

  const contextValue = {
    user: null,
    login: mockLogin,
    logout: jest.fn(),
    setUser: jest.fn(),
  };

  test("should render login form correctly", () => {
    render(
      <AuthContext.Provider value={contextValue}>
        <Login onClose={mockOnClose} onSubmit={mockSubmit} />
      </AuthContext.Provider>
    );

    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", {name: /Login/i})).toBeInTheDocument();
    expect(screen.getByRole("button", {name: /X/i})).toBeInTheDocument();
  });

  test("should call onClose when close button is clicked", () => {
    render(
      <AuthContext.Provider value={contextValue}>
        <Login onClose={mockOnClose} onSubmit={mockSubmit} />
      </AuthContext.Provider>
    );

    fireEvent.click(screen.getByRole("button", {name: /X/i}));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("should update input values when typing", () => {
    render(
      <AuthContext.Provider value={contextValue}>
        <Login onClose={mockOnClose} onSubmit={mockSubmit} />
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), {target: {value: "testuser"}});
    fireEvent.change(screen.getByLabelText(/Password/i), {target: {value: "testpass"}});

    expect(screen.getByLabelText(/Username/i)).toHaveValue("testuser");
    expect(screen.getByLabelText(/Password/i)).toHaveValue("testpass");
  });

  test("should submit form, calls login, and onClose on successful fetch", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({token: "testtoken", isAdmin: false}),
    });

    render(
      <AuthContext.Provider value={contextValue}>
        <Login onClose={mockOnClose} onSubmit={mockSubmit} />
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), {target: {value: "testuser"}});
    fireEvent.change(screen.getByLabelText(/Password/i), {target: {value: "testpass"}});

    fireEvent.click(screen.getByRole("button", {name: /Login/i}));
    expect(mockSubmit).toHaveBeenCalled();

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        username: "testuser",
        token: "testtoken",
        isAdmin: false,
      });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});