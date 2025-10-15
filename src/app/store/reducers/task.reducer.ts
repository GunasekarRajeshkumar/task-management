import { createReducer, on } from '@ngrx/store';
import { Task } from '../../models/task.model';
import * as TaskActions from '../actions/task.actions';

export interface TaskState {
  tasks: Task[];
  filteredTasks: Task[];
  loading: boolean;
  error: string | null;
  filters: {
    status?: string;
    priority?: string;
    projectId?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  };
}

export const initialState: TaskState = {
  tasks: [],
  filteredTasks: [],
  loading: false,
  error: null,
  filters: {}
};

export const taskReducer = createReducer(
  initialState,
  
  // Load Tasks
  on(TaskActions.loadTasks, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(TaskActions.loadTasksSuccess, (state, { tasks }) => ({
    ...state,
    tasks,
    filteredTasks: tasks,
    loading: false,
    error: null
  })),
  
  on(TaskActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Create Task
  on(TaskActions.createTask, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(TaskActions.createTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: [...state.tasks, task],
    filteredTasks: [...state.filteredTasks, task],
    loading: false,
    error: null
  })),
  
  on(TaskActions.createTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Update Task
  on(TaskActions.updateTask, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(TaskActions.updateTaskSuccess, (state, { task }) => {
    const updatedTasks = state.tasks.map(t => t.id === task.id ? task : t);
    const updatedFilteredTasks = state.filteredTasks.map(t => t.id === task.id ? task : t);
    
    return {
      ...state,
      tasks: updatedTasks,
      filteredTasks: updatedFilteredTasks,
      loading: false,
      error: null
    };
  }),
  
  on(TaskActions.updateTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Delete Task
  on(TaskActions.deleteTask, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(TaskActions.deleteTaskSuccess, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter(t => t.id !== id),
    filteredTasks: state.filteredTasks.filter(t => t.id !== id),
    loading: false,
    error: null
  })),
  
  on(TaskActions.deleteTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Filter Tasks
  on(TaskActions.filterTasks, (state, filters) => {
    let filtered = [...state.tasks];
    
    if (filters.status) {
      filtered = filtered.filter(task => task.status === filters.status);
    }
    
    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }
    
    if (filters.projectId) {
      filtered = filtered.filter(task => task.projectId === filters.projectId);
    }
    
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue: any = a[filters.sortBy as keyof Task];
        let bValue: any = b[filters.sortBy as keyof Task];
        
        if (filters.sortBy === 'dueDate') {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        }
        
        if (filters.sortOrder === 'desc') {
          return bValue > aValue ? 1 : -1;
        } else {
          return aValue > bValue ? 1 : -1;
        }
      });
    }
    
    return {
      ...state,
      filteredTasks: filtered,
      filters: { ...state.filters, ...filters }
    };
  })
);
