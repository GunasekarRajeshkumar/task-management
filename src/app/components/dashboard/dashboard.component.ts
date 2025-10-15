import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService, User } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { Task, TaskStatus } from '../../models/task.model';

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  notStartedTasks: number;
  overdueTasks: number;
  completionRate: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  stats: DashboardStats = {
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    notStartedTasks: 0,
    overdueTasks: 0,
    completionRate: 0
  };
  recentTasks: Task[] = [];
  overdueTasks: Task[] = [];
  showTaskForm = false;
  editingTask: Task | null = null;
  private subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadDashboardData();
    
    // Subscribe to task changes
    this.subscription.add(
      this.storageService.tasks$.subscribe(tasks => {
        this.updateDashboardData(tasks);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadDashboardData(): void {
    if (this.currentUser) {
      const userTasks = this.storageService.getTasksByUser(this.currentUser.id);
      this.updateDashboardData(userTasks);
    }
  }

  private updateDashboardData(tasks: Task[]): void {
    if (!this.currentUser) return;

    const userTasks = tasks.filter(task => task.userId === this.currentUser!.id);
    const now = new Date();

    this.stats = {
      totalTasks: userTasks.length,
      completedTasks: userTasks.filter(t => t.status === TaskStatus.COMPLETED).length,
      inProgressTasks: userTasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
      notStartedTasks: userTasks.filter(t => t.status === TaskStatus.NOT_STARTED).length,
      overdueTasks: userTasks.filter(t => 
        new Date(t.dueDate) < now && t.status !== TaskStatus.COMPLETED
      ).length,
      completionRate: userTasks.length > 0 
        ? Math.round((userTasks.filter(t => t.status === TaskStatus.COMPLETED).length / userTasks.length) * 100)
        : 0
    };

    // Get recent tasks (last 5)
    this.recentTasks = userTasks
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    // Get overdue tasks
    this.overdueTasks = userTasks.filter(t => 
      new Date(t.dueDate) < now && t.status !== TaskStatus.COMPLETED
    ).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
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

  onDeleteTask(taskId: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.storageService.deleteTask(taskId);
    }
  }

  onStatusChange(task: Task, newStatus: TaskStatus): void {
    const updatedTask = { ...task, status: newStatus };
    this.storageService.updateTask(updatedTask);
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  getPriorityClass(priority: string): string {
    return `priority-${priority}`;
  }

  getStatusClass(status: TaskStatus): string {
    return `status-${status}`;
  }

  isOverdue(task: Task): boolean {
    return new Date(task.dueDate) < new Date() && task.status !== TaskStatus.COMPLETED;
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }

  getStatusCount(status: string): number {
    if (!this.currentUser) return 0;
    const userTasks = this.storageService.getTasksByUser(this.currentUser.id);
    return userTasks.filter((task: Task) => task.status === status).length;
  }

  getStatusPercentage(status: string): number {
    if (this.stats.totalTasks === 0) return 0;
    return (this.getStatusCount(status) / this.stats.totalTasks) * 100;
  }

  getPriorityCount(priority: string): number {
    if (!this.currentUser) return 0;
    const userTasks = this.storageService.getTasksByUser(this.currentUser.id);
    return userTasks.filter((task: Task) => task.priority === priority).length;
  }

  getPriorityPercentage(priority: string): number {
    if (this.stats.totalTasks === 0) return 0;
    return (this.getPriorityCount(priority) / this.stats.totalTasks) * 100;
  }
}