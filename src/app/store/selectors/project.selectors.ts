import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProjectState } from '../reducers/project.reducer';
import { Project } from '../../models/project.model';

export const selectProjectState = createFeatureSelector<ProjectState>('projects');

export const selectAllProjects = createSelector(
  selectProjectState,
  (state) => state.projects
);

export const selectProjectLoading = createSelector(
  selectProjectState,
  (state) => state.loading
);

export const selectProjectError = createSelector(
  selectProjectState,
  (state) => state.error
);

export const selectProjectById = createSelector(
  selectAllProjects,
  (projects: Project[], id: string) => projects.find((project: Project) => project.id === id)
);
