import { render, screen, fireEvent } from "@testing-library/react";
import Login from "./Login";

describe("Login Component", () => {
  const mockOnClose = jest.fn();
  const mockSubmit = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockSubmit.mockClear();
  });

  test("should render login form correctly", () => {
    render(<Login onClose={mockOnClose} onSubmit={mockSubmit} />);

    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", {name: /Login/i})).toBeInTheDocument();
    expect(screen.getByRole("button", {name: /X/i})).toBeInTheDocument();
  });

  test("should call onClose when close button is clicked", () => {
    render(<Login onClose={mockOnClose} onSubmit={mockSubmit} />);
    fireEvent.click(screen.getByRole("button", {name: /X/i}));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("should update input values when typing", () => {
    render(<Login onClose={mockOnClose} onSubmit={mockSubmit} />);

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(usernameInput, {target: {value: "testuser"}});
    fireEvent.change(passwordInput, {target: {value: "testpass"}});

    expect(usernameInput).toHaveValue("testuser");
    expect(passwordInput).toHaveValue("testpass");
  });

  test("should submit form correctly", () => {
    render(<Login onClose={mockOnClose} onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByLabelText(/Username/i), {target: {value: "testuser"}});
    fireEvent.change(screen.getByLabelText(/Password/i), {target: {value: "testpass"}});

    fireEvent.click(screen.getByRole("button", {name: /Login/i}));
    expect(mockSubmit).toHaveBeenCalled();
  });
});