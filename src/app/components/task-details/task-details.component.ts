import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Task, TaskStatus, TaskPriority } from '../../models/task.model';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit {
  @Input() task: Task | null = null;
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() taskUpdated = new EventEmitter<Task>();
  @Output() taskDeleted = new EventEmitter<string>();

  TaskStatus = TaskStatus;
  TaskPriority = TaskPriority;

  ngOnInit(): void {}

  onClose(): void {
    this.close.emit();
  }

  onStatusChange(newStatus: TaskStatus): void {
    if (this.task) {
      const updatedTask = { ...this.task, status: newStatus };
      this.taskUpdated.emit(updatedTask);
    }
  }

  onPriorityChange(newPriority: TaskPriority): void {
    if (this.task) {
      const updatedTask = { ...this.task, priority: newPriority };
      this.taskUpdated.emit(updatedTask);
    }
  }

  onDelete(): void {
    if (this.task && confirm('Are you sure you want to delete this task?')) {
      this.taskDeleted.emit(this.task.id);
    }
  }

  getPriorityClass(priority: TaskPriority): string {
    return `priority-${priority}`;
  }

  getStatusClass(status: TaskStatus): string {
    return `status-${status}`;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  isOverdue(): boolean {
    if (!this.task) return false;
    return new Date(this.task.dueDate) < new Date() && this.task.status !== TaskStatus.COMPLETED;
  }

  getDaysUntilDue(): number {
    if (!this.task) return 0;
    const today = new Date();
    const dueDate = new Date(this.task.dueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
