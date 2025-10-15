import { createReducer, on } from '@ngrx/store';
import { Project } from '../../models/project.model';
import * as ProjectActions from '../actions/project.actions';

export interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

export const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: null
};

export const projectReducer = createReducer(
  initialState,
  
  // Load Projects
  on(ProjectActions.loadProjects, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(ProjectActions.loadProjectsSuccess, (state, { projects }) => ({
    ...state,
    projects,
    loading: false,
    error: null
  })),
  
  on(ProjectActions.loadProjectsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Create Project
  on(ProjectActions.createProject, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(ProjectActions.createProjectSuccess, (state, { project }) => ({
    ...state,
    projects: [...state.projects, project],
    loading: false,
    error: null
  })),
  
  on(ProjectActions.createProjectFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Update Project
  on(ProjectActions.updateProject, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(ProjectActions.updateProjectSuccess, (state, { project }) => ({
    ...state,
    projects: state.projects.map(p => p.id === project.id ? project : p),
    loading: false,
    error: null
  })),
  
  on(ProjectActions.updateProjectFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Delete Project
  on(ProjectActions.deleteProject, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(ProjectActions.deleteProjectSuccess, (state, { id }) => ({
    ...state,
    projects: state.projects.filter(p => p.id !== id),
    loading: false,
    error: null
  })),
  
  on(ProjectActions.deleteProjectFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
