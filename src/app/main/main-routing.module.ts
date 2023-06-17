import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './containers/main-layout/main-layout.component';
import { CMSetupComponent } from './pages/main-page/cmsetup/cmsetup.component';
import { WorkordersComponent } from './pages/workorders/workorders.component';
import { CreditAccountComponent } from './pages/credit-account/credit-account.component';
import { TestComponent } from './pages/test/test.component';
import { ProfileComponent } from './containers/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'cm-setup',
        component: CMSetupComponent,
      },
      {
        path: 'promissory-note',
        loadChildren: () =>
          import('./pages/promissory-note/promissory-note.module').then(
            (m) => m.PromissoryNoteModule
          ),
      },
      {
        path: 'workorders/:id',
        loadChildren: () =>
          import('./pages/promissory-note/promissory-note.module').then(
            (m) => m.PromissoryNoteModule
          ),
      },
      {
        path: 'reschedule/:id',
        loadChildren: () =>
          import('./pages/work-order-reschedule/work-order-reschedule.module').then(
            (m) => m.WorkOrderRescheduleModule
          ),
      },
      {
        path: 'transfer/:id',
        loadChildren: () =>
          import('./pages/work-order-transfer/work-order-transfer.module').then(
            (m) => m.WorkOrderTransferModule
          ),
      },
      {
        path: 'workorders',
        component: WorkordersComponent,
      },
      {
        path: 'credit-account',
        component: CreditAccountComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'test',
        component: TestComponent,
      },

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
