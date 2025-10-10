import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "./Register";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Register Component (Axios)", () => {
  const mockOnClose = jest.fn();
  const mockSubmit = jest.fn();
  const mockLogin = jest.fn();

  const contextValue = {
    user: null,
    login: mockLogin,
    logout: jest.fn(),
    setUser: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render registration form correctly", () => {
    render(
      <AuthContext.Provider value={contextValue}>
        <Register onClose={mockOnClose} onSubmit={mockSubmit} />
      </AuthContext.Provider>
    );

    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Register/i })).toBeInTheDocument();
  });

  test("should call onClose when close button is clicked", () => {
    render(
      <AuthContext.Provider value={contextValue}>
        <Register onClose={mockOnClose} onSubmit={mockSubmit} />
      </AuthContext.Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: /X/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("should update input values when typing", () => {
    render(
      <AuthContext.Provider value={contextValue}>
        <Register onClose={mockOnClose} onSubmit={mockSubmit} />
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "testuser" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@email.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "testpass" } });

    expect(screen.getByLabelText(/Username/i)).toHaveValue("testuser");
    expect(screen.getByLabelText(/Email/i)).toHaveValue("test@email.com");
    expect(screen.getByLabelText(/Password/i)).toHaveValue("testpass");
  });

  test("should submit form, calls login and onClose on success", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { token: "testtoken", admin: false },
      status: 200,
    });

    render(
      <AuthContext.Provider value={contextValue}>
        <Register onClose={mockOnClose} onSubmit={mockSubmit} />
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "testuser" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@email.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "testpass" } });
    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    expect(mockSubmit).toHaveBeenCalled();

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        username: "testuser",
        token: "testtoken",
        admin: false,
      });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});