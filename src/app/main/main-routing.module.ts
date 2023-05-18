import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './containers/main-layout/main-layout.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { CMSetupComponent } from './pages/main-page/cmsetup/cmsetup.component';
import { PromissoryNoteComponent } from './pages/promissory-note/promissory-note.component';
import { PromissoryNoteOrderComponent } from './pages/promissory-note-order/promissory-note-order.component';
import { WorkordersComponent } from './pages/workorders/workorders.component';
import { WorkOrderCreateComponent } from './pages/workorders/work-order-create/work-order-create.component';
import { AllorderComponent } from './pages/workorders/allorder/allorder.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: MainPageComponent,
      },
      {
        path: 'cm-setup',
        component: CMSetupComponent,
      },
      {
        path: 'promissory-note',
        component: PromissoryNoteComponent,
      },
      // {
      //   path: 'promissory-order',
      //   component: PromissoryNoteOrderComponent,
      // },
      // {
      //   path: 'workorders',
      //     loadChildren: () => import('./pages/workorders/workorder.module').then((m) => m.WorkOrderModule),
      // },
      {
        path: 'workorders',
        component: WorkordersComponent,
      },
      {
        path: 'createorders',
        component: WorkOrderCreateComponent,
      },
      {
        path: 'allorder',
        component: AllorderComponent,
      },
      {
        path: '',
        redirectTo: 'cm-setup', pathMatch: 'full'
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule { }
