import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TaskState } from '../reducers/task.reducer';
import { Task } from '../../models/task.model';

export const selectTaskState = createFeatureSelector<TaskState>('tasks');

export const selectAllTasks = createSelector(
  selectTaskState,
  (state) => state.tasks
);

export const selectFilteredTasks = createSelector(
  selectTaskState,
  (state) => state.filteredTasks
);

export const selectTaskLoading = createSelector(
  selectTaskState,
  (state) => state.loading
);

export const selectTaskError = createSelector(
  selectTaskState,
  (state) => state.error
);

export const selectTasksByProject = createSelector(
  selectAllTasks,
  (tasks: Task[], projectId: string) => tasks.filter((task: Task) => task.projectId === projectId)
);

export const selectTasksByStatus = createSelector(
  selectFilteredTasks,
  (tasks: Task[], status: string) => tasks.filter((task: Task) => task.status === status)
);

export const selectTasksByPriority = createSelector(
  selectFilteredTasks,
  (tasks: Task[], priority: string) => tasks.filter((task: Task) => task.priority === priority)
);

export const selectTaskStats = createSelector(
  selectAllTasks,
  (tasks) => ({
    total: tasks.length,
    notStarted: tasks.filter(t => t.status === 'not_started').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length
  })
);
