import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkOrderTransferComponent } from './work-order-transfer.component';

const routes: Routes = [{ path: '', component: WorkOrderTransferComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkOrderTransferRoutingModule { }
