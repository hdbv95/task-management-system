import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import Modal from ".";
import { useTaskContext } from "../../context/TaskContext";
import { Task } from "../../types";

jest.mock("../../context/TaskContext", () => ({
  __esModule: true,
  useTaskContext: jest.fn(),
}));

jest.mock("../../utils/api", () => ({
  __esModule: true,
  getUsers: jest.fn().mockResolvedValue([]),
}));

describe("Modal Component", () => {
  const mockOnModalClose = jest.fn();
  const mockOnInputChange = jest.fn();
  const mockAddTask = jest.fn();

  const mockTask: Task = {
    id: 1,
    title: "",
    description: "",
    due_date: new Date(),
    status: "pending",
    created_at: new Date(),
    updated_at: new Date(),
    assigned_to: 1,
    assigned_to_username: "",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useTaskContext as jest.Mock).mockReturnValue({ addTask: mockAddTask });
  });

  it("renders the modal correctly", () => {
    render(
      <Modal
        onModalClose={mockOnModalClose}
        onInputChange={mockOnInputChange}
        newTask={mockTask}
      />,
    );
    expect(screen.getByText("Add New Task")).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Due Date")).toBeInTheDocument();
  });

  it("calls onInputChange when user types in fields", async () => {
    render(
      <Modal
        onModalClose={mockOnModalClose}
        onInputChange={mockOnInputChange}
        newTask={mockTask}
      />,
    );
    const titleInput = screen.getByLabelText("Title");
    await userEvent.type(titleInput, "New Task Title");
    expect(mockOnInputChange).toHaveBeenCalled();
  });

  it("closes modal when cancel button is clicked", async () => {
    render(
      <Modal
        onModalClose={mockOnModalClose}
        onInputChange={mockOnInputChange}
        newTask={mockTask}
      />,
    );
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await userEvent.click(cancelButton);
    expect(mockOnModalClose).toHaveBeenCalled();
  });
});
