import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Task, TaskStatus, TaskPriority } from '../../models/task.model';
import { StorageService } from '../../services/storage.service';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-virtual-task-list',
  templateUrl: './virtual-task-list.component.html',
  styleUrls: ['./virtual-task-list.component.scss']
})
export class VirtualTaskListComponent implements OnInit, OnDestroy {
  @ViewChild('taskItem', { static: true }) taskItemTemplate!: TemplateRef<any>;
  
  currentUser: User | null = null;
  allTasks: Task[] = [];
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

  // Virtual scrolling configuration
  itemSize = 120; // Height of each task item in pixels
  minBufferPx = 200;
  maxBufferPx = 400;

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.subscription.add(
      this.storageService.tasks$.subscribe(tasks => {
        this.allTasks = tasks.filter(task => task.userId === this.currentUser?.id);
        this.applyFilters();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  applyFilters(): void {
    let filtered = [...this.allTasks];

    // Filter by status
    if (this.filters.status) {
      filtered = filtered.filter(task => task.status === this.filters.status);
    }

    // Filter by priority
    if (this.filters.priority) {
      filtered = filtered.filter(task => task.priority === this.filters.priority);
    }

    // Filter by project
    if (this.filters.projectId) {
      filtered = filtered.filter(task => task.projectId === this.filters.projectId);
    }

    // Sort tasks
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (this.filters.sortBy) {
        case 'dueDate':
          aValue = new Date(a.dueDate).getTime();
          bValue = new Date(b.dueDate).getTime();
          break;
        case 'priority':
          const priorityOrder = { [TaskPriority.URGENT]: 4, [TaskPriority.HIGH]: 3, [TaskPriority.MEDIUM]: 2, [TaskPriority.LOW]: 1 };
          aValue = priorityOrder[a.priority] || 0;
          bValue = priorityOrder[b.priority] || 0;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
      }

      if (this.filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    this.filteredTasks = filtered;
  }

  onFilterChange(): void {
    this.applyFilters();
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

  trackByTaskId(index: number, task: Task): string {
    return task.id;
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
