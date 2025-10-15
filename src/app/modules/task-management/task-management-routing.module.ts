import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from '../../components/task-list/task-list.component';
import { VirtualTaskListComponent } from '../../components/virtual-task-list/virtual-task-list.component';
import { KanbanBoardComponent } from '../../components/kanban-board/kanban-board.component';
import { AuthGuard } from '../../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: TaskListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'virtual',
    component: VirtualTaskListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'board',
    component: KanbanBoardComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskManagementRoutingModule { }
