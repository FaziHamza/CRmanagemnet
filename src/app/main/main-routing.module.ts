import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './containers/main-layout/main-layout.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { CMSetupComponent } from './pages/main-page/cmsetup/cmsetup.component';
import { PromissoryNoteComponent } from './pages/promissory-note/promissory-note.component';
import { PromissoryNoteOrderComponent } from './pages/promissory-note-order/promissory-note-order.component';

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
        path: 'promissory-order',
        component: PromissoryNoteOrderComponent,
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
export class MainRoutingModule {}
