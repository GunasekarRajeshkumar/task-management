export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  taskIds: string[];
}

export interface CreateProjectRequest {
  name: string;
  description: string;
}

export interface UpdateProjectRequest {
  id: string;
  name?: string;
  description?: string;
}

export interface ProjectSummary {
  id: string;
  name: string;
  description: string;
  totalTasks: number;
  notStartedTasks: number;
  inProgressTasks: number;
  completedTasks: number;
}
