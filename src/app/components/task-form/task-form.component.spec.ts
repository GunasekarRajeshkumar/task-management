import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import { TaskFormComponent } from './task-form.component';
import { Task, TaskPriority } from '../../models/task.model';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let mockStore: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'select']);

    await TestBed.configureTestingModule({
      declarations: [TaskFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: Store, useValue: storeSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    
    // Mock the projects selector
    mockStore.select.and.returnValue(of([]));
  });

  beforeEach(() => {
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.taskForm.get('title')?.value).toBe('');
    expect(component.taskForm.get('description')?.value).toBe('');
    expect(component.taskForm.get('priority')?.value).toBe(TaskPriority.MEDIUM);
  });

  it('should patch form values when task input is provided', () => {
    const mockTask: Task = {
      id: '1',
      title: 'Test Task',
      description: 'Test Description',
      dueDate: new Date('2024-12-31'),
      priority: TaskPriority.HIGH,
      status: 'not_started',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    component.task = mockTask;
    component.ngOnInit();

    expect(component.taskForm.get('title')?.value).toBe('Test Task');
    expect(component.taskForm.get('description')?.value).toBe('Test Description');
    expect(component.taskForm.get('priority')?.value).toBe(TaskPriority.HIGH);
  });

  it('should dispatch create task action when form is valid and no task is provided', () => {
    component.taskForm.patchValue({
      title: 'New Task',
      description: 'New Description',
      dueDate: '2024-12-31',
      priority: TaskPriority.MEDIUM
    });

    component.onSubmit();

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        type: '[Task] Create Task',
        task: jasmine.objectContaining({
          title: 'New Task',
          description: 'New Description',
          priority: TaskPriority.MEDIUM
        })
      })
    );
  });

  it('should dispatch update task action when form is valid and task is provided', () => {
    const mockTask: Task = {
      id: '1',
      title: 'Test Task',
      description: 'Test Description',
      dueDate: new Date('2024-12-31'),
      priority: TaskPriority.HIGH,
      status: 'not_started',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    component.task = mockTask;
    component.taskForm.patchValue({
      title: 'Updated Task',
      description: 'Updated Description',
      dueDate: '2024-12-31',
      priority: TaskPriority.URGENT
    });

    component.onSubmit();

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        type: '[Task] Update Task',
        task: jasmine.objectContaining({
          id: '1',
          title: 'Updated Task',
          description: 'Updated Description',
          priority: TaskPriority.URGENT
        })
      })
    );
  });

  it('should not dispatch action when form is invalid', () => {
    component.taskForm.patchValue({
      title: '', // Invalid - empty title
      description: 'Test Description',
      dueDate: '2024-12-31',
      priority: TaskPriority.MEDIUM
    });

    component.onSubmit();

    expect(mockStore.dispatch).not.toHaveBeenCalled();
  });

  it('should emit formSubmit event when form is submitted successfully', () => {
    spyOn(component.formSubmit, 'emit');
    
    component.taskForm.patchValue({
      title: 'Test Task',
      description: 'Test Description',
      dueDate: '2024-12-31',
      priority: TaskPriority.MEDIUM
    });

    component.onSubmit();

    expect(component.formSubmit.emit).toHaveBeenCalled();
  });

  it('should emit formSubmit event when form is cancelled', () => {
    spyOn(component.formSubmit, 'emit');

    component.onCancel();

    expect(component.formSubmit.emit).toHaveBeenCalled();
  });

  it('should return correct error message for required field', () => {
    const titleControl = component.taskForm.get('title');
    titleControl?.markAsTouched();
    titleControl?.setErrors({ required: true });

    const errorMessage = component.getFieldError('title');
    expect(errorMessage).toBe('title is required');
  });

  it('should return correct error message for maxlength field', () => {
    const titleControl = component.taskForm.get('title');
    titleControl?.markAsTouched();
    titleControl?.setErrors({ maxlength: true });

    const errorMessage = component.getFieldError('title');
    expect(errorMessage).toBe('title is too long');
  });

  it('should return empty string when no errors', () => {
    const titleControl = component.taskForm.get('title');
    titleControl?.markAsTouched();
    titleControl?.setErrors(null);

    const errorMessage = component.getFieldError('title');
    expect(errorMessage).toBe('');
  });
});