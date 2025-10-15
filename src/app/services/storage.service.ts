import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task, TaskStatus, TaskPriority } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();
  private readonly TASKS_KEY = 'task_management_tasks';

  constructor() {
    this.loadTasksFromStorage();
  }

  // Task CRUD Operations
  createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const newTask: Task = {
      ...task,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const tasks = this.getStoredTasks();
    tasks.push(newTask);
    this.updateTasks(tasks);
    return newTask;
  }

  updateTask(updatedTask: Task): Task {
    const tasks = this.getStoredTasks();
    const index = tasks.findIndex(t => t.id === updatedTask.id);
    
    if (index !== -1) {
      tasks[index] = {
        ...updatedTask,
        updatedAt: new Date()
      };
      this.updateTasks(tasks);
      return tasks[index];
    }
    
    throw new Error('Task not found');
  }

  deleteTask(taskId: string): boolean {
    const tasks = this.getStoredTasks();
    const filteredTasks = tasks.filter(t => t.id !== taskId);
    
    if (filteredTasks.length !== tasks.length) {
      this.updateTasks(filteredTasks);
      return true;
    }
    
    return false;
  }

  getTask(taskId: string): Task | null {
    const tasks = this.getStoredTasks();
    return tasks.find(t => t.id === taskId) || null;
  }

  getAllTasks(): Task[] {
    return this.getStoredTasks();
  }

  getTasksByUser(userId: string): Task[] {
    const tasks = this.getStoredTasks();
    return tasks.filter(t => t.userId === userId);
  }

  getTasksByStatus(status: TaskStatus): Task[] {
    const tasks = this.getStoredTasks();
    return tasks.filter(t => t.status === status);
  }

  getTasksByPriority(priority: TaskPriority): Task[] {
    const tasks = this.getStoredTasks();
    return tasks.filter(t => t.priority === priority);
  }

  searchTasks(query: string): Task[] {
    const tasks = this.getStoredTasks();
    const lowercaseQuery = query.toLowerCase();
    
    return tasks.filter(task => 
      task.title.toLowerCase().includes(lowercaseQuery) ||
      task.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Statistics
  getTaskStats(userId: string): {
    total: number;
    completed: number;
    inProgress: number;
    notStarted: number;
    overdue: number;
  } {
    const userTasks = this.getTasksByUser(userId);
    const now = new Date();
    
    return {
      total: userTasks.length,
      completed: userTasks.filter(t => t.status === TaskStatus.COMPLETED).length,
      inProgress: userTasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
      notStarted: userTasks.filter(t => t.status === TaskStatus.NOT_STARTED).length,
      overdue: userTasks.filter(t => 
        new Date(t.dueDate) < now && t.status !== TaskStatus.COMPLETED
      ).length
    };
  }

  // Private methods
  private loadTasksFromStorage(): void {
    try {
      const tasks = this.getStoredTasks(); // This now handles date conversion
      this.tasksSubject.next(tasks);
    } catch (error) {
      console.error('Failed to load tasks from storage:', error);
      this.tasksSubject.next([]);
    }
  }

  private updateTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
      this.tasksSubject.next(tasks);
    } catch (error) {
      console.error('Failed to update tasks in storage:', error);
    }
  }

  private getStoredTasks(): Task[] {
    try {
      const stored = localStorage.getItem(this.TASKS_KEY);
      if (stored) {
        const tasks = JSON.parse(stored);
        // Convert date strings back to Date objects
        return tasks.map((task: any) => ({
          ...task,
          dueDate: new Date(task.dueDate),
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt)
        }));
      }
      return [];
    } catch (error) {
      console.error('Failed to get stored tasks:', error);
      return [];
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Clear all data (for testing)
  clearAllData(): void {
    localStorage.removeItem(this.TASKS_KEY);
    localStorage.removeItem('task_management_user');
    localStorage.removeItem('task_management_users');
    this.tasksSubject.next([]);
  }
}
