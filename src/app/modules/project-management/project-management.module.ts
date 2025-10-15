import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ProjectListComponent } from '../../components/project-list/project-list.component';
import { ProjectFormComponent } from '../../components/project-form/project-form.component';
import { ProjectManagementRoutingModule } from './project-management-routing.module';

@NgModule({
  declarations: [
    ProjectListComponent,
    ProjectFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ProjectManagementRoutingModule
  ]
})
export class ProjectManagementModule { }
