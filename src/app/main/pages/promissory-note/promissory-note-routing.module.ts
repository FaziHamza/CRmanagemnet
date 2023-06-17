import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromissoryNoteComponent } from './promissory-note.component';

const routes: Routes = [{ path: '', component: PromissoryNoteComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromissoryNoteRoutingModule { }
