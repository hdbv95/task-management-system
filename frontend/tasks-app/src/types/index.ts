export type Status = "pending" | "in_progress" | "completed";

export type Task = {
  id: number;
  title: string;
  description: string;
  due_date: Date;
  status: Status;
  created_at: Date;
  updated_at: Date;
  assigned_to: number;
  assigned_to_username: string;
};

export type TaskApiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Task[];
};

export type User = {
  id: number;
  username: string;
};
export type UserApiResponse = User[];

export type TokenApiResponse = {
  refresh: string;
  access: string;
};

export type TokenRefreshApiResponse = {
  access: string;
};
