import { createAction, props } from '@ngrx/store';
import { Project, CreateProjectRequest, UpdateProjectRequest } from '../../models/project.model';

// Load Projects
export const loadProjects = createAction('[Project] Load Projects');
export const loadProjectsSuccess = createAction(
  '[Project] Load Projects Success',
  props<{ projects: Project[] }>()
);
export const loadProjectsFailure = createAction(
  '[Project] Load Projects Failure',
  props<{ error: string }>()
);

// Create Project
export const createProject = createAction(
  '[Project] Create Project',
  props<{ project: CreateProjectRequest }>()
);
export const createProjectSuccess = createAction(
  '[Project] Create Project Success',
  props<{ project: Project }>()
);
export const createProjectFailure = createAction(
  '[Project] Create Project Failure',
  props<{ error: string }>()
);

// Update Project
export const updateProject = createAction(
  '[Project] Update Project',
  props<{ project: UpdateProjectRequest }>()
);
export const updateProjectSuccess = createAction(
  '[Project] Update Project Success',
  props<{ project: Project }>()
);
export const updateProjectFailure = createAction(
  '[Project] Update Project Failure',
  props<{ error: string }>()
);

// Delete Project
export const deleteProject = createAction(
  '[Project] Delete Project',
  props<{ id: string }>()
);
export const deleteProjectSuccess = createAction(
  '[Project] Delete Project Success',
  props<{ id: string }>()
);
export const deleteProjectFailure = createAction(
  '[Project] Delete Project Failure',
  props<{ error: string }>()
);
