import { createAction, props } from '@ngrx/store';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../../models/task.model';

// Load Tasks
export const loadTasks = createAction('[Task] Load Tasks');
export const loadTasksSuccess = createAction(
  '[Task] Load Tasks Success',
  props<{ tasks: Task[] }>()
);
export const loadTasksFailure = createAction(
  '[Task] Load Tasks Failure',
  props<{ error: string }>()
);

// Create Task
export const createTask = createAction(
  '[Task] Create Task',
  props<{ task: CreateTaskRequest }>()
);
export const createTaskSuccess = createAction(
  '[Task] Create Task Success',
  props<{ task: Task }>()
);
export const createTaskFailure = createAction(
  '[Task] Create Task Failure',
  props<{ error: string }>()
);

// Update Task
export const updateTask = createAction(
  '[Task] Update Task',
  props<{ task: UpdateTaskRequest }>()
);
export const updateTaskSuccess = createAction(
  '[Task] Update Task Success',
  props<{ task: Task }>()
);
export const updateTaskFailure = createAction(
  '[Task] Update Task Failure',
  props<{ error: string }>()
);

// Delete Task
export const deleteTask = createAction(
  '[Task] Delete Task',
  props<{ id: string }>()
);
export const deleteTaskSuccess = createAction(
  '[Task] Delete Task Success',
  props<{ id: string }>()
);
export const deleteTaskFailure = createAction(
  '[Task] Delete Task Failure',
  props<{ error: string }>()
);

// Filter and Sort Tasks
export const filterTasks = createAction(
  '[Task] Filter Tasks',
  props<{ 
    status?: string; 
    priority?: string; 
    projectId?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }>()
);
