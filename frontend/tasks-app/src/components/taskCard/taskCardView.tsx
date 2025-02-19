import { CardContent, Typography } from "@mui/material";
import { Task } from "../../types";

const TaskCardView: React.FC<Task> = (task) => {
  const formatStatus = (value: string) =>
    value.replace(/_/g, " ").toUpperCase();
  return (
    <CardContent className="flex flex-col !space-y-2">
      <Typography variant="h5" className="!font-semibold text-gray-800">
        {task.title}
      </Typography>
      <Typography
        variant="body2"
        className={`self-center capitalize py-1 px-3 text-xs !font-semibold rounded-lg ${
          task.status === "completed"
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {formatStatus(task.status)}
      </Typography>
      <Typography variant="body2" className="text-gray-600">
        {task.description}
      </Typography>
      <Typography variant="body2" className="text-sm text-gray-500">
        Assigned to:{" "}
        <span className="font-medium text-gray-800">
          {task.assigned_to_username}
        </span>
      </Typography>
    </CardContent>
  );
};

export default TaskCardView;
