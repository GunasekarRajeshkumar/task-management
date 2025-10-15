import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Project, CreateProjectRequest, UpdateProjectRequest } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projects: Project[] = [];
  private nextId = 1;

  constructor() {
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData(): void {
    const sampleProjects: Project[] = [
      {
        id: '1',
        name: 'Task Management App',
        description: 'A comprehensive task management system built with Angular and NgRx',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
        taskIds: ['1', '2', '3']
      },
      {
        id: '2',
        name: 'Documentation',
        description: 'Create comprehensive documentation for the project',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
        taskIds: []
      }
    ];
    
    this.projects = sampleProjects;
    this.nextId = 3;
  }

  getProjects(): Observable<Project[]> {
    return of([...this.projects]).pipe(delay(500));
  }

  getProjectById(id: string): Observable<Project | undefined> {
    const project = this.projects.find(p => p.id === id);
    return of(project).pipe(delay(200));
  }

  createProject(request: CreateProjectRequest): Observable<Project> {
    // Input validation
    if (!request.name || request.name.trim().length === 0) {
      return throwError(() => new Error('Project name is required'));
    }
    
    if (request.name.length > 100) {
      return throwError(() => new Error('Project name must be less than 100 characters'));
    }
    
    if (request.description && request.description.length > 500) {
      return throwError(() => new Error('Project description must be less than 500 characters'));
    }

    // Check for duplicate project names
    const existingProject = this.projects.find(p => 
      p.name.toLowerCase() === request.name.toLowerCase()
    );
    
    if (existingProject) {
      return throwError(() => new Error('Project with this name already exists'));
    }

    // Sanitize input to prevent XSS
    const sanitizedName = this.sanitizeInput(request.name);
    const sanitizedDescription = request.description ? this.sanitizeInput(request.description) : '';

    const newProject: Project = {
      id: this.nextId.toString(),
      name: sanitizedName,
      description: sanitizedDescription,
      createdAt: new Date(),
      updatedAt: new Date(),
      taskIds: []
    };

    this.projects.push(newProject);
    this.nextId++;

    return of(newProject).pipe(delay(300));
  }

  updateProject(request: UpdateProjectRequest): Observable<Project> {
    const projectIndex = this.projects.findIndex(p => p.id === request.id);
    
    if (projectIndex === -1) {
      return throwError(() => new Error('Project not found'));
    }

    // Input validation
    if (request.name !== undefined) {
      if (!request.name || request.name.trim().length === 0) {
        return throwError(() => new Error('Project name is required'));
      }
      
      if (request.name.length > 100) {
        return throwError(() => new Error('Project name must be less than 100 characters'));
      }
    }
    
    if (request.description !== undefined && request.description.length > 500) {
      return throwError(() => new Error('Project description must be less than 500 characters'));
    }

    // Check for duplicate project names (excluding current project)
    if (request.name) {
      const existingProject = this.projects.find(p => 
        p.id !== request.id && p.name.toLowerCase() === request.name!.toLowerCase()
      );
      
      if (existingProject) {
        return throwError(() => new Error('Project with this name already exists'));
      }
    }

    // Sanitize input to prevent XSS
    const updatedProject = {
      ...this.projects[projectIndex],
      ...request,
      name: request.name ? this.sanitizeInput(request.name) : this.projects[projectIndex].name,
      description: request.description !== undefined ? 
        (request.description ? this.sanitizeInput(request.description) : '') : 
        this.projects[projectIndex].description,
      updatedAt: new Date()
    };

    this.projects[projectIndex] = updatedProject;

    return of(updatedProject).pipe(delay(300));
  }

  deleteProject(id: string): Observable<void> {
    const projectIndex = this.projects.findIndex(p => p.id === id);
    
    if (projectIndex === -1) {
      return throwError(() => new Error('Project not found'));
    }

    this.projects.splice(projectIndex, 1);

    return of(undefined).pipe(delay(200));
  }

  private sanitizeInput(input: string): string {
    // Basic XSS prevention - remove script tags and dangerous characters
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }
}
