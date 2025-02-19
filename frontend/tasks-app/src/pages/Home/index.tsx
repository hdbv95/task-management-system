import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import { Container, Fab } from "@mui/material";
import { Add } from "@mui/icons-material";
import Modal from "../../components/modal";
import TaskCard from "../../components/taskCard";
import { getTasks } from "../../utils/api";
import { TaskApiResponse, Task } from "../../types";
import { useTaskContext } from "../../context/TaskContext";

const emptyTask: Task = {
  id: 0,
  title: "",
  description: "",
  due_date: new Date(),
  status: "pending",
  created_at: new Date(),
  updated_at: new Date(),
  assigned_to: 1,
  assigned_to_username: "admin",
};

function Home() {
  const { tasks, setTasks, addTask } = useTaskContext();
  const [data, setData] = useState<TaskApiResponse>();
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [newTask, setNewTask] = useState<Task>(emptyTask);
  const [loading, setLoading] = useState(false);

  const getGridColumns = (count: number) => {
    if (count <= 3) return { xs: 12 };
    return { xs: 12, sm: 6, md: 4 };
  };

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      setLoading(true);
      try {
        const response = await getTasks();
        setData(response);
        setTasks(response.results);
      } catch (error) {
        setError(`Failed to obtain token: ${error}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [setTasks]);

  const handleAddTask = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewTask(emptyTask);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: name === "due_date" ? new Date(value) : value,
    }));
  };

  const loadMoreTasks = async () => {
    if (!data?.next || loading) return; // Exit if no data or if loading

    setLoading(true);
    try {
      const nextPageResponse = await getTasks(data.next);
      setData(nextPageResponse);
      addTask(nextPageResponse.results);
    } catch (error) {
      setError(`Failed to load more tasks. ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fixed>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

      <div
        onScroll={(e) => {
          const target = e.target as HTMLDivElement;
          const bottom =
            target.scrollHeight ===
            Math.ceil(target.scrollTop + target.clientHeight);
          if (bottom && !loading) {
            loadMoreTasks();
          }
        }}
        style={{
          height: "calc(100vh - 350px)", // Adjust the height based on screen size
          overflowY: "auto",
          marginBottom: "16px",
          scrollbarWidth: "none", // For Firefox
          msOverflowStyle: "none", // For Internet Explorer 10+
        }}
      >
        <Grid container spacing={2}>
          {data &&
            tasks.map((task) => (
              <Grid size={{ ...getGridColumns(data.count) }} key={task.id}>
                <TaskCard {...task} />
              </Grid>
            ))}
        </Grid>
      </div>

      <Fab
        color="primary"
        aria-label="add"
        onClick={handleAddTask}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        <Add />
      </Fab>

      {openModal && (
        <Modal
          onModalClose={handleCloseModal}
          onInputChange={handleInputChange}
          newTask={newTask}
        />
      )}
    </Container>
  );
}

export default Home;
