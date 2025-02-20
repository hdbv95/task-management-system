import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import TaskCard from ".";
import { Task } from "../../types";
import { useTaskContext } from "../../context/TaskContext";

jest.mock("../../context/TaskContext", () => ({
  __esModule: true,
  useTaskContext: jest.fn(),
}));

describe("TaskCard", () => {
  const mockUpdateContextTask = jest.fn();
  const mockDeleteContextTask = jest.fn();

  beforeEach(() => {
    (useTaskContext as jest.Mock).mockReturnValue({
      updateContextTask: mockUpdateContextTask,
      deleteContextTask: mockDeleteContextTask,
    });
  });

  const mockTask: Task = {
    id: 1,
    title: "Test Task",
    description: "Description",
    due_date: new Date(),
    status: "pending",
    created_at: new Date(),
    updated_at: new Date(),
    assigned_to: 1,
    assigned_to_username: "admin",
  };

  it("renders task", async () => {
    render(<TaskCard {...mockTask} />);
    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });

  it("switches to edit mode when the edit button is clicked", async () => {
    render(<TaskCard {...mockTask} />);
    const editButton = await screen.findByTestId("editButton");
    await userEvent.click(editButton);
    const input = await screen.findByTestId("titleInput");
    expect(input).toBeInTheDocument();
  });
});
