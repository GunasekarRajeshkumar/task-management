import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { TaskFormComponent } from '../components/task-form/task-form.component';

@NgModule({
  declarations: [
    TaskFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    TaskFormComponent
  ]
})
export class SharedModule { }
