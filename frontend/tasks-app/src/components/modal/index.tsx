import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Status, Task, UserApiResponse } from "../../types";
import { getUsers } from "../../utils/api";

interface ModalProps {
  onModalClose: () => void;
  onSaveNewTask: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  newTask: Task;
}

const Modal: React.FC<ModalProps> = ({
  onModalClose,
  onSaveNewTask,
  onInputChange,
  newTask,
}) => {
  const [users, setUsers] = useState<UserApiResponse>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response);
      } catch (error) {
        console.error("Failed to load users", error);
      }
    };
    fetchUsers();
  }, []);

  const handleStatusChange = (e: SelectChangeEvent) => {
    const value = e.target.value as Status;
    onInputChange({
      target: { name: e.target.name, value },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleAssignedChange = (e: SelectChangeEvent) => {
    const value = e.target.value ? Number(e.target.value) : null;
    onInputChange({
      target: { name: e.target.name, value },
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  const assignedToValue = users.some((user) => user.id === newTask.assigned_to)
    ? String(newTask.assigned_to)
    : "";

  return (
    <Dialog open={true} onClose={onModalClose}>
      <DialogTitle>Add New Task</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="title"
          label="Title"
          fullWidth
          value={newTask.title}
          onChange={onInputChange}
        />
        <TextField
          margin="dense"
          name="description"
          label="Description"
          fullWidth
          value={newTask.description}
          onChange={onInputChange}
        />
        <TextField
          margin="dense"
          name="due_date"
          label="Due Date"
          type="date"
          fullWidth
          value={
            newTask.due_date instanceof Date
              ? newTask.due_date.toISOString().split("T")[0]
              : ""
          }
          onChange={onInputChange}
        />

        <div className="flex gap-4">
          <FormControl fullWidth size="small" margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={newTask.status}
              onChange={handleStatusChange}
              label="Status"
              name="status"
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth size="small" margin="dense">
            <InputLabel>Assign To</InputLabel>
            <Select
              value={assignedToValue}
              onChange={handleAssignedChange}
              label="Assign To"
              name="assigned_to"
            >
              {users &&
                users.map((user) => (
                  <MenuItem key={user.id} value={String(user.id)}>
                    {user.username}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onModalClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onSaveNewTask} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
