import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkOrderRescheduleComponent } from './work-order-reschedule.component';

const routes: Routes = [{ path: '', component: WorkOrderRescheduleComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkOrderRescheduleRoutingModule { }
