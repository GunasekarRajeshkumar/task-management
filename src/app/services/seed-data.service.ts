import { Injectable } from '@angular/core';
import { Task, TaskPriority, TaskStatus } from '../models/task.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class SeedDataService {
  constructor(private storageService: StorageService) {}

  seedDefaultTasks(userId: string): void {
    const existingTasks = this.storageService.getAllTasks();
    const userTasks = existingTasks.filter(task => task.userId === userId);
    
    // Only seed if user has no tasks
    if (userTasks.length === 0) {
      const defaultTasks: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[] = [
        {
          title: 'Setup Project Infrastructure',
          description: 'Initialize the project with proper folder structure, dependencies, and configuration files.',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
          priority: TaskPriority.HIGH,
          status: TaskStatus.IN_PROGRESS,
          userId: userId
        },
        {
          title: 'Design User Interface Mockups',
          description: 'Create wireframes and mockups for the main application screens including dashboard, task list, and forms.',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
          priority: TaskPriority.MEDIUM,
          status: TaskStatus.NOT_STARTED,
          userId: userId
        },
        {
          title: 'Implement Authentication System',
          description: 'Build user registration, login, and session management functionality with proper security measures.',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          priority: TaskPriority.HIGH,
          status: TaskStatus.NOT_STARTED,
          userId: userId
        },
        {
          title: 'Create Task Management CRUD',
          description: 'Develop complete task creation, reading, updating, and deletion functionality with proper validation.',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          priority: TaskPriority.HIGH,
          status: TaskStatus.NOT_STARTED,
          userId: userId
        },
        {
          title: 'Build Kanban Board Component',
          description: 'Implement drag-and-drop kanban board for visual task management with status columns.',
          dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
          priority: TaskPriority.MEDIUM,
          status: TaskStatus.NOT_STARTED,
          userId: userId
        },
        {
          title: 'Add Data Persistence',
          description: 'Implement local storage functionality to save and retrieve user data and tasks.',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
          priority: TaskPriority.MEDIUM,
          status: TaskStatus.COMPLETED,
          userId: userId
        },
        {
          title: 'Implement Responsive Design',
          description: 'Ensure the application works perfectly on mobile, tablet, and desktop devices.',
          dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
          priority: TaskPriority.MEDIUM,
          status: TaskStatus.NOT_STARTED,
          userId: userId
        },
        {
          title: 'Add Task Filtering and Search',
          description: 'Implement advanced filtering options and search functionality for better task management.',
          dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
          priority: TaskPriority.LOW,
          status: TaskStatus.NOT_STARTED,
          userId: userId
        },
        {
          title: 'Create User Dashboard',
          description: 'Build a comprehensive dashboard with task statistics, recent activities, and quick actions.',
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
          priority: TaskPriority.HIGH,
          status: TaskStatus.COMPLETED,
          userId: userId
        },
        {
          title: 'Write Documentation',
          description: 'Create comprehensive documentation for the project including setup instructions and API documentation.',
          dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
          priority: TaskPriority.LOW,
          status: TaskStatus.NOT_STARTED,
          userId: userId
        }
      ];

      // Create all default tasks
      defaultTasks.forEach(taskData => {
        this.storageService.createTask(taskData);
      });
    }
  }
}
