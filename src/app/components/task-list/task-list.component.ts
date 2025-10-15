import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Task, TaskStatus, TaskPriority } from '../../models/task.model';
import { StorageService } from '../../services/storage.service';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks$: Observable<Task[]>;
  currentUser: User | null = null;
  filteredTasks: Task[] = [];
  showTaskForm = false;
  editingTask: Task | null = null;
  private subscription = new Subscription();
  
  TaskStatus = TaskStatus;
  TaskPriority = TaskPriority;
  
  filters = {
    status: '',
    priority: '',
    projectId: '',
    sortBy: 'dueDate',
    sortOrder: 'asc' as 'asc' | 'desc'
  };

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router
  ) {
    this.tasks$ = this.storageService.tasks$;
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadTasks();
    
    this.subscription.add(
      this.tasks$.subscribe(tasks => {
        this.applyFilters(tasks);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadTasks(): void {
    if (this.currentUser) {
      const userTasks = this.storageService.getTasksByUser(this.currentUser.id);
      this.applyFilters(userTasks);
    }
  }

  private applyFilters(tasks: Task[]): void {
    if (!this.currentUser) return;

    let filtered = tasks.filter(task => task.userId === this.currentUser!.id);

    if (this.filters.status) {
      filtered = filtered.filter(task => task.status === this.filters.status);
    }

    if (this.filters.priority) {
      filtered = filtered.filter(task => task.priority === this.filters.priority);
    }

    // Sort tasks
    filtered.sort((a, b) => {
      const aValue = this.getSortValue(a);
      const bValue = this.getSortValue(b);
      
      if (this.filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    this.filteredTasks = filtered;
  }

  private getSortValue(task: Task): any {
    switch (this.filters.sortBy) {
      case 'title':
        return task.title.toLowerCase();
      case 'priority':
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[task.priority as keyof typeof priorityOrder] || 0;
      case 'status':
        const statusOrder = { completed: 3, in_progress: 2, not_started: 1 };
        return statusOrder[task.status as keyof typeof statusOrder] || 0;
      case 'dueDate':
      default:
        return new Date(task.dueDate).getTime();
    }
  }

  onFilterChange(event?: Event): void {
    this.loadTasks();
  }

  onStatusChange(task: Task, newStatus: TaskStatus): void {
    const updatedTask = { ...task, status: newStatus };
    this.storageService.updateTask(updatedTask);
  }

  onDeleteTask(taskId: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.storageService.deleteTask(taskId);
    }
  }

  getPriorityClass(priority: TaskPriority): string {
    return `priority-${priority}`;
  }

  getStatusClass(status: TaskStatus): string {
    return `status-${status}`;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  isOverdue(task: Task): boolean {
    return new Date(task.dueDate) < new Date() && task.status !== TaskStatus.COMPLETED;
  }

  onCreateTask(): void {
    this.editingTask = null;
    this.showTaskForm = true;
  }

  onEditTask(task: Task): void {
    this.editingTask = task;
    this.showTaskForm = true;
  }

  onTaskSaved(task: Task): void {
    this.showTaskForm = false;
    this.editingTask = null;
    // Task is already saved by the TaskFormComponent
  }

  onTaskFormCancelled(): void {
    this.showTaskForm = false;
    this.editingTask = null;
  }
}
