import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { ValidationService } from './validation.service';
import { ErrorHandlingService } from './error-handling.service';
import { Task, CreateTaskRequest, TaskPriority } from '../models/task.model';

describe('TaskService', () => {
  let service: TaskService;
  let validationService: jasmine.SpyObj<ValidationService>;
  let errorHandlingService: jasmine.SpyObj<ErrorHandlingService>;

  beforeEach(() => {
    const validationSpy = jasmine.createSpyObj('ValidationService', ['validateTask']);
    const errorHandlingSpy = jasmine.createSpyObj('ErrorHandlingService', ['handleValidationError']);

    TestBed.configureTestingModule({
      providers: [
        TaskService,
        { provide: ValidationService, useValue: validationSpy },
        { provide: ErrorHandlingService, useValue: errorHandlingSpy }
      ]
    });

    service = TestBed.inject(TaskService);
    validationService = TestBed.inject(ValidationService) as jasmine.SpyObj<ValidationService>;
    errorHandlingService = TestBed.inject(ErrorHandlingService) as jasmine.SpyObj<ErrorHandlingService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createTask', () => {
    it('should create a task with valid data', (done) => {
      const createRequest: CreateTaskRequest = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date('2024-12-31'),
        priority: TaskPriority.MEDIUM
      };

      validationService.validateTask.and.returnValue({
        isValid: true,
        errors: []
      });

      service.createTask(createRequest).subscribe(task => {
        expect(task.title).toBe('Test Task');
        expect(task.description).toBe('Test Description');
        expect(task.priority).toBe(TaskPriority.MEDIUM);
        expect(task.status).toBe('not_started');
        done();
      });
    });

    it('should handle validation errors', (done) => {
      const createRequest: CreateTaskRequest = {
        title: '',
        description: 'Test Description',
        dueDate: new Date('2024-12-31'),
        priority: TaskPriority.MEDIUM
      };

      const validationErrors = [{
        field: 'title',
        message: 'Title is required',
        code: 'REQUIRED'
      }];

      validationService.validateTask.and.returnValue({
        isValid: false,
        errors: validationErrors
      });

      errorHandlingService.handleValidationError.and.returnValue(throwError(() => new Error('Validation failed')));

      service.createTask(createRequest).subscribe({
        error: (error) => {
          expect(errorHandlingService.handleValidationError).toHaveBeenCalledWith(validationErrors);
          done();
        }
      });
    });
  });

  describe('getTasks', () => {
    it('should return all tasks', (done) => {
      service.getTasks().subscribe(tasks => {
        expect(tasks).toBeDefined();
        expect(Array.isArray(tasks)).toBe(true);
        done();
      });
    });
  });

  describe('getTaskById', () => {
    it('should return a task by id', (done) => {
      service.getTaskById('1').subscribe(task => {
        expect(task).toBeDefined();
        expect(task?.id).toBe('1');
        done();
      });
    });

    it('should return undefined for non-existent task', (done) => {
      service.getTaskById('999').subscribe(task => {
        expect(task).toBeUndefined();
        done();
      });
    });
  });
});

function throwError(errorFactory: () => any): any {
  // Mock implementation for testing
  return { subscribe: (observer: any) => observer.error(errorFactory()) };
}
