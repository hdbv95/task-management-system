import {
  Card,
  CardActions,
  IconButton,
  SelectChangeEvent,
} from "@mui/material";
import { Edit, Save, Cancel, Delete } from "@mui/icons-material";
import { useState } from "react";
import TaskCardView from "./taskCardView";
import TaskCardEditForm from "./taskCardEditForm";
import { Status, Task } from "../../types";
import { useTaskContext } from "../../context/TaskContext";

const TaskCard: React.FC<Task> = (task) => {
  const { updateContextTask, deleteContextTask } = useTaskContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    if (loading) return; // Prevent re-submit while loading
    setLoading(true);
    setError(null);
    try {
      await updateContextTask(editedTask);
      setIsEditing(false);
    } catch (error) {
      setError(`Failed to save the task. Please try again. ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setEditedTask(task); // Reset to original task
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (e: SelectChangeEvent) => {
    const value = e.target.value as Status;
    setEditedTask((prev) => ({ ...prev, status: value }));
  };

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteContextTask(task.id);
    } catch (error) {
      setError(`Failed to delete the task. Please try again. ${error}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card
      variant="outlined"
      className="h-full w-full shadow-lg rounded-xl border border-gray-200"
    >
      {!isEditing ? (
        <TaskCardView {...task} />
      ) : (
        <TaskCardEditForm
          task={editedTask}
          handleChange={handleChange}
          handleStatusChange={handleStatusChange}
        />
      )}
      <CardActions>
        {isEditing ? (
          <>
            <IconButton onClick={handleSave} disabled={loading}>
              <Save />
            </IconButton>
            <IconButton onClick={handleCancel}>
              <Cancel />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton data-testid="editButton" onClick={handleEdit}>
              <Edit />
            </IconButton>
            <IconButton
              color="error"
              onClick={handleDelete}
              disabled={deleting}
            >
              <Delete />
            </IconButton>
          </>
        )}
      </CardActions>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </Card>
  );
};

export default TaskCard;
