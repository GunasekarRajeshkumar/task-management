import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { TaskListComponent } from '../../components/task-list/task-list.component';
import { VirtualTaskListComponent } from '../../components/virtual-task-list/virtual-task-list.component';
import { KanbanBoardComponent } from '../../components/kanban-board/kanban-board.component';
import { TaskManagementRoutingModule } from './task-management-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    TaskListComponent,
    VirtualTaskListComponent,
    KanbanBoardComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ScrollingModule,
    TaskManagementRoutingModule,
    SharedModule
  ]
})
export class TaskManagementModule { }
