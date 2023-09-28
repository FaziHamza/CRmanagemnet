import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateEarlySettlementComponent } from './create-early-settlement/create-early-settlement.component';
import { PromissoryNoteComponent } from './promissory-note.component';

const routes: Routes = [
  { path: '', component: PromissoryNoteComponent},
  { path: 'create-settlement', component: CreateEarlySettlementComponent, }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromissoryNoteRoutingModule { }
