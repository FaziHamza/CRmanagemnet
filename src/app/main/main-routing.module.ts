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
import { OrderdetailComponent } from './pages/workorders/orderdetail/orderdetail.component';
import { UpdateOrderComponent } from './pages/workorders/update-order/update-order.component';
import { CreditAccountComponent } from './pages/credit-account/credit-account.component';

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
      {
        path: 'workorders',
        component: WorkordersComponent,
      },
      {
        path: 'createorders',
        component: WorkOrderCreateComponent,
      },
      {
        path: 'updateorders/:id',
        component: UpdateOrderComponent,
      },
      {
        path: 'allorder',
        component: AllorderComponent,
      },
      {
        path: 'credit-account',
        component: CreditAccountComponent,
      },
      {
        path: 'orde-details/:id',
        component: OrderdetailComponent,
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
