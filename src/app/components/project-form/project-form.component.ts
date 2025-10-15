import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Project, CreateProjectRequest } from '../../models/project.model';
import { CustomValidators } from '../../validators/custom.validators';
import * as ProjectActions from '../../store/actions/project.actions';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})
export class ProjectFormComponent implements OnInit {
  @Input() project?: Project;
  @Output() formSubmit = new EventEmitter<void>();
  
  projectForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.projectForm = this.fb.group({
      name: ['', [
        Validators.required, 
        Validators.maxLength(100),
        CustomValidators.noXSS()
      ]],
      description: ['', [
        Validators.maxLength(500),
        CustomValidators.noXSS()
      ]]
    });
  }

  ngOnInit(): void {
    if (this.project) {
      this.projectForm.patchValue({
        name: this.project.name,
        description: this.project.description
      });
    }
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      const formValue = this.projectForm.value;
      const projectData: CreateProjectRequest = {
        name: formValue.name.trim(),
        description: formValue.description?.trim() || ''
      };

      if (this.project) {
        // Update existing project
        this.store.dispatch(ProjectActions.updateProject({
          project: {
            id: this.project.id,
            ...projectData
          }
        }));
      } else {
        // Create new project
        this.store.dispatch(ProjectActions.createProject({
          project: projectData
        }));
      }

      this.projectForm.reset();
      this.formSubmit.emit();
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.projectForm.reset();
    this.formSubmit.emit();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.projectForm.controls).forEach(key => {
      const control = this.projectForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.projectForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName} is required`;
      }
      if (field.errors['maxlength']) {
        return `${fieldName} is too long`;
      }
    }
    return '';
  }
}
