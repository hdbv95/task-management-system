import {
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CardContent,
  Typography,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { Task } from "../../types";

interface TaskCardEditFormProps {
  task: Task;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleStatusChange: (e: SelectChangeEvent) => void;
}

const TaskCardEditForm: React.FC<TaskCardEditFormProps> = ({
  task,
  handleChange,
  handleStatusChange,
}) => (
  <CardContent className="flex flex-col !space-y-2">
    <TextField
      data-testid="titleInput"
      label="Title"
      variant="outlined"
      fullWidth
      value={task.title}
      name="title"
      onChange={handleChange}
      size="small"
    />
    <TextField
      label="Description"
      variant="outlined"
      fullWidth
      multiline
      rows={4}
      value={task.description}
      name="description"
      onChange={handleChange}
      size="small"
    />
    <div className="flex justify-between items-center !space-x-2">
      <FormControl fullWidth size="small">
        <InputLabel>Status</InputLabel>
        <Select
          value={task.status}
          onChange={handleStatusChange}
          label="Status"
          name="status"
          size="small"
        >
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="in_progress">In progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="body2" className="text-sm text-gray-500">
        Assigned to:{" "}
        <span className="font-medium text-gray-800">
          {task.assigned_to_username}
        </span>
      </Typography>
    </div>
  </CardContent>
);

export default TaskCardEditForm;
