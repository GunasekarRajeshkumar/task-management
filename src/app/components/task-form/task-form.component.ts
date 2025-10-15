import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task, TaskPriority, CreateTaskRequest } from '../../models/task.model';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit, OnChanges {
  @Input() task?: Task;
  @Input() isEdit = false;
  @Output() taskSaved = new EventEmitter<Task>();
  @Output() cancelled = new EventEmitter<void>();

  taskForm: FormGroup;
  isSubmitting = false;
  TaskPriority = TaskPriority;

  constructor(
    private fb: FormBuilder,
    private storageService: StorageService,
    private authService: AuthService
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      dueDate: ['', [Validators.required]],
      priority: [TaskPriority.MEDIUM, [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Form is already initialized in constructor
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] && this.isEdit && this.task) {
      this.populateForm();
    }
  }

  private populateForm(): void {
    if (this.task) {
      const formData = {
        title: this.task.title,
        description: this.task.description,
        dueDate: this.formatDateForInput(this.task.dueDate),
        priority: this.task.priority
      };
      this.taskForm.patchValue(formData);
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid && this.authService.getCurrentUser()) {
      this.isSubmitting = true;
      
      const formData = this.taskForm.value;
      const currentUser = this.authService.getCurrentUser()!;
      
      const taskData: CreateTaskRequest = {
        title: formData.title,
        description: formData.description,
        dueDate: new Date(formData.dueDate),
        priority: formData.priority
      };

      try {
        let savedTask: Task;
        
        if (this.isEdit && this.task) {
          // Update existing task
          const updatedTask = {
            ...this.task,
            ...taskData,
            userId: currentUser.id
          };
          savedTask = this.storageService.updateTask(updatedTask);
        } else {
          // Create new task
          savedTask = this.storageService.createTask({
            ...taskData,
            userId: currentUser.id,
            status: 'not_started' as any
          });
        }
        
        this.taskSaved.emit(savedTask);
        this.resetForm();
      } catch (error) {
        console.error('Error saving task:', error);
      } finally {
        this.isSubmitting = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.cancelled.emit();
    this.resetForm();
  }

  private resetForm(): void {
    this.taskForm.reset({
      priority: TaskPriority.MEDIUM
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.taskForm.controls).forEach(key => {
      const control = this.taskForm.get(key);
      control?.markAsTouched();
    });
  }

  private formatDateForInput(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getFieldError(fieldName: string): string {
    const field = this.taskForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName} is required`;
      }
      if (field.errors['minlength']) {
        return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  getPriorityOptions(): { value: TaskPriority; label: string; color: string; description: string }[] {
    return [
      { 
        value: TaskPriority.LOW, 
        label: 'Low Priority', 
        color: '#22c55e',
        description: 'Low priority tasks can be completed when convenient'
      },
      { 
        value: TaskPriority.MEDIUM, 
        label: 'Medium Priority', 
        color: '#f59e0b',
        description: 'Medium priority tasks should be completed soon'
      },
      { 
        value: TaskPriority.HIGH, 
        label: 'High Priority', 
        color: '#ef4444',
        description: 'High priority tasks need immediate attention'
      },
      { 
        value: TaskPriority.URGENT, 
        label: 'Urgent Priority', 
        color: '#dc2626',
        description: 'Urgent tasks require immediate action'
      }
    ];
  }
}