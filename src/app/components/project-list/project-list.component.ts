import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Project } from '../../models/project.model';
import { selectAllProjects, selectProjectLoading, selectProjectError } from '../../store/selectors/project.selectors';
import * as ProjectActions from '../../store/actions/project.actions';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  projects$: Observable<Project[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private store: Store) {
    this.projects$ = this.store.select(selectAllProjects);
    this.loading$ = this.store.select(selectProjectLoading);
    this.error$ = this.store.select(selectProjectError);
  }

  ngOnInit(): void {
    this.store.dispatch(ProjectActions.loadProjects());
  }

  onDeleteProject(projectId: string): void {
    if (confirm('Are you sure you want to delete this project? This will also delete all associated tasks.')) {
      this.store.dispatch(ProjectActions.deleteProject({ id: projectId }));
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}
