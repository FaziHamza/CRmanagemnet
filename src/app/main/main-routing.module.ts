import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './containers/main-layout/main-layout.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { CMSetupComponent } from './pages/main-page/cmsetup/cmsetup.component';
import { PromissoryNoteComponent } from './pages/promissory-note/promissory-note.component';
import { WorkordersComponent } from './pages/workorders/workorders.component';
import { CreditAccountComponent } from './pages/credit-account/credit-account.component';
import { TestComponent } from './pages/test/test.component';
import { ProfileComponent } from './containers/profile/profile.component';
import { WorkOrderRescheduleComponent } from './pages/work-order-reschedule/work-order-reschedule.component';
import { WorkOrderTransferComponent } from './pages/work-order-transfer/work-order-transfer.component';

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
        component: PromissoryNoteComponent,
      },
      {
        path: 'workorders/:id',
        component: PromissoryNoteComponent,
      },
      {
        path: 'reschedule/:id',
        component: WorkOrderRescheduleComponent,
      },
      {
        path: 'transfer/:id',
        component: WorkOrderTransferComponent,
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
