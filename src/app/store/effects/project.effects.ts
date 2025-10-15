import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProjectService } from '../../services/project.service';
import * as ProjectActions from '../actions/project.actions';

@Injectable()
export class ProjectEffects {
  constructor(
    private actions$: Actions,
    private projectService: ProjectService
  ) {}

  loadProjects$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectActions.loadProjects),
      switchMap(() =>
        this.projectService.getProjects().pipe(
          map(projects => ProjectActions.loadProjectsSuccess({ projects })),
          catchError(error => of(ProjectActions.loadProjectsFailure({ error: error.message })))
        )
      )
    )
  );

  createProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectActions.createProject),
      switchMap(({ project }) =>
        this.projectService.createProject(project).pipe(
          map(newProject => ProjectActions.createProjectSuccess({ project: newProject })),
          catchError(error => of(ProjectActions.createProjectFailure({ error: error.message })))
        )
      )
    )
  );

  updateProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectActions.updateProject),
      switchMap(({ project }) =>
        this.projectService.updateProject(project).pipe(
          map(updatedProject => ProjectActions.updateProjectSuccess({ project: updatedProject })),
          catchError(error => of(ProjectActions.updateProjectFailure({ error: error.message })))
        )
      )
    )
  );

  deleteProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectActions.deleteProject),
      switchMap(({ id }) =>
        this.projectService.deleteProject(id).pipe(
          map(() => ProjectActions.deleteProjectSuccess({ id })),
          catchError(error => of(ProjectActions.deleteProjectFailure({ error: error.message })))
        )
      )
    )
  );
}
