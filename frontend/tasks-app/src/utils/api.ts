import axios from "axios";
import {
  Task,
  TaskApiResponse,
  TokenApiResponse,
  TokenRefreshApiResponse,
  UserApiResponse,
} from "../types";

const API_URL_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000/api/"
    : "http://backend:8000/api/";

let accessToken: string | null = localStorage.getItem("access_token") || null;
let refreshToken: string | null = localStorage.getItem("refresh_token") || null;
let refreshTimer: NodeJS.Timeout | null = null;

async function fetchToken(): Promise<void> {
  try {
    const response = await axios.post<TokenApiResponse>(
      `${API_URL_BASE}token/`,
      {
        username: "admin",
        password: "admin",
      },
    );

    accessToken = response.data.access;
    refreshToken = response.data.refresh;
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);

    scheduleTokenRefresh(4 * 60 * 1000); // Refresh before expiration (default time is 5mins)
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Failed to obtain token:", error);
    }
    throw new Error("Authentication failed.");
  }
}

async function refreshAccessToken(): Promise<void> {
  if (!refreshToken) {
    console.error("No refresh token available.");
    await fetchToken();
    return;
  }
  try {
    const response = await axios.post<TokenRefreshApiResponse>(
      `${API_URL_BASE}token/refresh/`,
      { refresh: refreshToken },
    );
    accessToken = response.data.access;
    localStorage.setItem("access_token", accessToken);

    scheduleTokenRefresh(4 * 60 * 1000); // Refresh again before expiration
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Failed to refresh token, logging in again:", error);
    }
    await fetchToken();
  }
}

function scheduleTokenRefresh(delay: number) {
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = setTimeout(refreshAccessToken, delay);
}

async function getAuthHeader(): Promise<{ Authorization: string }> {
  if (!accessToken) {
    await fetchToken();
  }
  return { Authorization: `Bearer ${accessToken}` };
}

async function apiRequest<T>(
  method: "get" | "post" | "patch" | "delete",
  url: string,
  data?: Record<string, unknown>,
): Promise<T> {
  try {
    const headers = await getAuthHeader();
    const response = await axios({
      method,
      url,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      data: data ? JSON.stringify(data) : undefined,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.warn("Token expired, refreshing...");
      await refreshAccessToken();
      return apiRequest(method, url, data); // Retry with new token
    }
    if (axios.isAxiosError(error)) {
      console.error(
        `Error in ${method.toUpperCase()} ${url}:`,
        error?.response?.data || error.message,
      );
    }
    throw new Error("API request failed.");
  }
}

export async function getTasks(next?: string) {
  return apiRequest<TaskApiResponse>("get", next || `${API_URL_BASE}tasks/`);
}

export async function createTask(task: Task) {
  const formattedTask = {
    title: task.title,
    description: task.description,
    due_date: task.due_date.toISOString().split("T")[0], // Ensure proper formatting
    status: task.status,
    assigned_to: task.assigned_to,
  };
  return apiRequest<Task>("post", `${API_URL_BASE}tasks/`, formattedTask);
}

export async function updateTask(task: Task) {
  return apiRequest<void>("patch", `${API_URL_BASE}tasks/${task.id}/`, task);
}

export async function deleteTask(id: number) {
  return apiRequest<void>("delete", `${API_URL_BASE}tasks/${id}/`);
}

export async function getUsers() {
  return apiRequest<UserApiResponse>("get", `${API_URL_BASE}users/`);
}
