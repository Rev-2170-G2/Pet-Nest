import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Register from "./Register";

describe("Register Component", () => {
  const mockOnClose = jest.fn();
  const mockSubmit = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockSubmit.mockClear();
  });

  test("should render registration form correctly", () => {
    render(<Register onClose={mockOnClose} onSubmit={mockSubmit} />);

    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", {name: /Register/i})).toBeInTheDocument();
    expect(screen.getByRole("button", {name: /X/i})).toBeInTheDocument();
  });

  test("calls onClose when close button is clicked", () => {
    render(<Register onClose={mockOnClose} onSubmit={mockSubmit} />);
    fireEvent.click(screen.getByRole("button", {name: /X/i}));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("updates input values when typing", () => {
    render(<Register onClose={mockOnClose} onSubmit={mockSubmit} />);

    const usernameInput = screen.getByLabelText(/Username/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(usernameInput, {target: {value: "testuser"}});
    fireEvent.change(emailInput, {target: {value: "test@email.com"}});
    fireEvent.change(passwordInput, {target: {value: "testpass"}});

    expect(usernameInput).toHaveValue("testuser");
    expect(emailInput).toHaveValue("test@email.com");
    expect(passwordInput).toHaveValue("testpass");
  });

  test("submits form correctly", () => {
    render(<Register onClose={mockOnClose} onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByLabelText(/Username/i), {target: {value: "testuser"}});
    fireEvent.change(screen.getByLabelText(/Email/i), {target: {value: "test@email.com"}});
    fireEvent.change(screen.getByLabelText(/Password/i), {target: {value: "testpass"}});

    fireEvent.click(screen.getByRole("button", {name: /Register/i}));
    expect(mockSubmit).toHaveBeenCalled();
  });
});
