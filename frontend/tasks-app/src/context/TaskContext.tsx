import React, { createContext, useState, useContext, ReactNode } from "react";
import { Task } from "../types";
import { updateTask, deleteTask, createTask } from "../utils/api";

interface TaskContext {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addTask: (newTasks: Task[] | Task) => void;
  updateContextTask: (updatedTask: Task) => void;
  deleteContextTask: (taskId: number) => void;
}

const TaskContext = createContext<TaskContext | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = async (newTasks: Task[] | Task) => {
    try {
      const tasksToAdd = Array.isArray(newTasks)
        ? newTasks
        : [await createTask(newTasks)];

      setTasks((prevTasks) => {
        const allTasks = [...prevTasks, ...tasksToAdd]; // Append to the bottom
        return Array.from(
          new Map(allTasks.map((task) => [task.id, task])).values(),
        );
      });
    } catch (error) {
      console.error("Error adding task:", error);
      throw error;
    }
  };

  const updateContextTask = async (updatedTask: Task) => {
    try {
      await updateTask(updatedTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task,
        ),
      );
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  };

  const deleteContextTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  };

  return (
    <TaskContext.Provider
      value={{ tasks, setTasks, addTask, updateContextTask, deleteContextTask }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};
