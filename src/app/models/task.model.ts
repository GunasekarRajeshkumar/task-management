export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  projectId?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum TaskStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
  projectId?: string;
}

export interface UpdateTaskRequest {
  id: string;
  title?: string;
  description?: string;
  dueDate?: Date;
  priority?: TaskPriority;
  status?: TaskStatus;
  projectId?: string;
}
