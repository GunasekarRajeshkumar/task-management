import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockStore: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'select']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: Store, useValue: storeSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    
    // Mock the auth selectors
    mockStore.select.and.returnValue(of(false)); // loading
    mockStore.select.and.returnValue(of(null)); // error
  });

  beforeEach(() => {
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.loginForm.get('username')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should dispatch login action when form is valid', () => {
    component.loginForm.patchValue({
      username: 'testuser',
      password: 'testpassword'
    });

    component.onSubmit();

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        type: '[Auth] Login',
        credentials: {
          username: 'testuser',
          password: 'testpassword'
        }
      })
    );
  });

  it('should not dispatch login action when form is invalid', () => {
    component.loginForm.patchValue({
      username: '', // Invalid - empty username
      password: 'testpassword'
    });

    component.onSubmit();

    expect(mockStore.dispatch).not.toHaveBeenCalled();
  });

  it('should clear auth error on init', () => {
    component.ngOnInit();

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        type: '[Auth] Clear Error'
      })
    );
  });

  it('should mark all form controls as touched when form is invalid', () => {
    component.loginForm.patchValue({
      username: '',
      password: ''
    });

    spyOn(component as any, 'markFormGroupTouched');

    component.onSubmit();

    expect((component as any).markFormGroupTouched).toHaveBeenCalled();
  });

  it('should return correct error message for required field', () => {
    const usernameControl = component.loginForm.get('username');
    usernameControl?.markAsTouched();
    usernameControl?.setErrors({ required: true });

    const errorMessage = component.getFieldError('username');
    expect(errorMessage).toBe('username is required');
  });

  it('should return correct error message for minlength field', () => {
    const usernameControl = component.loginForm.get('username');
    usernameControl?.markAsTouched();
    usernameControl?.setErrors({ minlength: true });

    const errorMessage = component.getFieldError('username');
    expect(errorMessage).toBe('username is too short');
  });

  it('should return empty string when no errors', () => {
    const usernameControl = component.loginForm.get('username');
    usernameControl?.markAsTouched();
    usernameControl?.setErrors(null);

    const errorMessage = component.getFieldError('username');
    expect(errorMessage).toBe('');
  });

  it('should trim username and password before submission', () => {
    component.loginForm.patchValue({
      username: '  testuser  ',
      password: '  testpassword  '
    });

    component.onSubmit();

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        credentials: {
          username: 'testuser', // trimmed
          password: '  testpassword  ' // password not trimmed for security
        }
      })
    );
  });
});
