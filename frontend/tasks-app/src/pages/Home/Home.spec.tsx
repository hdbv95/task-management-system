import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { render, screen, act } from "@testing-library/react";
import { TaskProvider } from "../../context/TaskContext";
import { getTasks } from "../../utils/api";
import Home from ".";

jest.mock("../../utils/api", () => ({
  __esModule: true,
  getTasks: jest.fn(),
}));

jest.mock("../../components/modal", () => ({
  __esModule: true,
  default: ({ onModalClose }: { onModalClose: () => void }) => (
    <div data-testid="modal">
      <button onClick={onModalClose}> Close </button>
    </div>
  ),
}));

jest.mock("../../components/taskCard", () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => (
    <div data-testid="task-card"> {title} </div>
  ),
}));

describe("TaskContext", () => {
  const mockTask = {
    id: 1,
    title: "Test Task",
    description: "Description",
    due_date: new Date().toISOString(),
    status: "pending",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    assigned_to: 1,
    assigned_to_username: "admin",
  };

  beforeEach(() => {
    (getTasks as jest.Mock).mockResolvedValue({
      results: [mockTask],
      next: null,
      count: 1,
    });
  });

  it("renders tasks correctly", async () => {
    await act(async () =>
      render(
        <TaskProvider>
          <Home />
        </TaskProvider>,
      ),
    );
    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });

  it("shows an error message when API call fails", async () => {
    (getTasks as jest.Mock).mockRejectedValue(new Error("API error"));
    await act(async () =>
      render(
        <TaskProvider>
          <Home />
        </TaskProvider>,
      ),
    );
    expect(screen.getByText(/Failed to obtain token/i)).toBeInTheDocument();
  });

  it("opens and closes the modal", async () => {
    await act(async () =>
      render(
        <TaskProvider>
          <Home />
        </TaskProvider>,
      ),
    );
    const addButton = screen.getByRole("button", { name: /add/i });
    await userEvent.click(addButton);
    const modal = await screen.findByTestId("modal");
    expect(modal).toBeInTheDocument();
    const closeButton = screen.getByText("Close");
    await userEvent.click(closeButton);
    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });
});
