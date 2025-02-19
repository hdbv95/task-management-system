import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import { Container, Fab } from "@mui/material";
import { Add } from "@mui/icons-material";
import Modal from "../../components/modal";
import TaskCard from "../../components/taskCard";
import { createTask, getTasks } from "../../utils/api";
import { TaskApiResponse, Task } from "../../types";

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
  const [data, setData] = useState<TaskApiResponse>();
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [newTask, setNewTask] = useState<Task>(emptyTask);

  const [loadedTasks, setLoadedTasks] = useState<Task[]>([]);
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
        setLoadedTasks(response.results);
      } catch (error) {
        setError(`Failed to obtain token: ${error}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTaskUpdate = (updatedTask: Task) => {
    setLoadedTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task,
      ),
    );
  };

  const handleTaskDelete = (taskId: number) => {
    setLoadedTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== taskId),
    );
  };

  const handleAddTask = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewTask(emptyTask);
  };

  const handleSaveNewTask = async () => {
    setError(null);
    setLoading(true);
    try {
      const savedTask = await createTask(newTask);
      setLoadedTasks((prevTasks) => [savedTask, ...prevTasks]);
      setOpenModal(false);
      setNewTask(emptyTask);
    } catch (error) {
      setError(`Failed to save the task. Please try again. ${error}`);
    } finally {
      setLoading(false);
    }
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
    if (!data || loading) return; // Exit if no data or if loading
    if (!data.next) return;

    setLoading(true);
    try {
      const nextPageResponse = await getTasks(data.next);
      setData(nextPageResponse);
      setLoadedTasks((prevTasks) => {
        const allTasks = [...prevTasks, ...nextPageResponse.results];
        return Array.from(new Set(allTasks.map((task) => task.id))).map(
          (id) => allTasks.find((task) => task.id === id)!,
        ); // Ensure no duplicates
      });
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
            loadedTasks.map((task) => (
              <Grid size={{ ...getGridColumns(data.count) }} key={task.id}>
                <TaskCard
                  {...task}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskDelete={() => handleTaskDelete(task.id)}
                />
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
          onSaveNewTask={handleSaveNewTask}
          onInputChange={handleInputChange}
          newTask={newTask}
        />
      )}
    </Container>
  );
}

export default Home;
