import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Task, TaskStatus, TaskPriority } from '../../models/task.model';
import { StorageService } from '../../services/storage.service';
import { AuthService, User } from '../../services/auth.service';

interface KanbanColumn {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  color: string;
}

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss']
})
export class KanbanBoardComponent implements OnInit, OnDestroy {
  columns: KanbanColumn[] = [];
  currentUser: User | null = null;
  showTaskForm = false;
  editingTask: Task | null = null;
  private subscription = new Subscription();

  constructor(
    private storageService: StorageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    if (this.currentUser) {
      this.initializeColumns();
      this.loadTasks();
      
      // Subscribe to task changes
      this.subscription.add(
        this.storageService.tasks$.subscribe(tasks => {
          this.updateColumns(tasks);
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private initializeColumns(): void {
    this.columns = [
      {
        status: TaskStatus.NOT_STARTED,
        title: 'To Do',
        tasks: [],
        color: '#718096'
      },
      {
        status: TaskStatus.IN_PROGRESS,
        title: 'In Progress',
        tasks: [],
        color: '#3182ce'
      },
      {
        status: TaskStatus.COMPLETED,
        title: 'Done',
        tasks: [],
        color: '#38a169'
      }
    ];
  }

  private loadTasks(): void {
    if (this.currentUser) {
      const userTasks = this.storageService.getTasksByUser(this.currentUser.id);
      this.updateColumns(userTasks);
    }
  }

  private updateColumns(tasks: Task[]): void {
    if (!this.currentUser) return;

    const userTasks = tasks.filter(task => task.userId === this.currentUser!.id);
    
    this.columns.forEach(column => {
      column.tasks = userTasks.filter(task => task.status === column.status);
    });
  }

  onTaskStatusChange(task: Task, newStatus: TaskStatus): void {
    const updatedTask = { ...task, status: newStatus };
    this.storageService.updateTask(updatedTask);
  }

  onTaskDelete(taskId: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.storageService.deleteTask(taskId);
    }
  }

  getPriorityClass(priority: TaskPriority): string {
    return `priority-${priority}`;
  }

  getPriorityIcon(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.URGENT:
        return 'fas fa-exclamation-circle';
      case TaskPriority.HIGH:
        return 'fas fa-arrow-up';
      case TaskPriority.MEDIUM:
        return 'fas fa-minus';
      case TaskPriority.LOW:
        return 'fas fa-arrow-down';
      default:
        return 'fas fa-circle';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }

  isOverdue(task: Task): boolean {
    return new Date(task.dueDate) < new Date() && task.status !== TaskStatus.COMPLETED;
  }

  getColumnStats(column: KanbanColumn): { count: number; overdue: number } {
    const overdue = column.tasks.filter(task => this.isOverdue(task)).length;
    return {
      count: column.tasks.length,
      overdue
    };
  }

  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }

  // Drag and Drop functionality
  onDragStart(event: DragEvent, task: Task): void {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', task.id);
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDrop(event: DragEvent, targetStatus: TaskStatus): void {
    event.preventDefault();
    
    if (event.dataTransfer) {
      const taskId = event.dataTransfer.getData('text/plain');
      const task = this.findTaskById(taskId);
      
      if (task && task.status !== targetStatus) {
        const updatedTask = { ...task, status: targetStatus };
        this.storageService.updateTask(updatedTask);
      }
    }
  }

  private findTaskById(taskId: string): Task | null {
    for (const column of this.columns) {
      const task = column.tasks.find(t => t.id === taskId);
      if (task) return task;
    }
    return null;
  }

  onDragEnter(event: DragEvent): void {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.classList.add('drag-over');
  }

  onDragLeave(event: DragEvent): void {
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('drag-over');
  }

  onTaskEdit(task: Task): void {
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
