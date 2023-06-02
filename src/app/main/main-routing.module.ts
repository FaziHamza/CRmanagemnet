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
      // {
      //   path: 'promissory-note',
      //   component: PromissoryNoteComponent,
      // },
      {
        path: 'workorders/:id',
        component: PromissoryNoteComponent,
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
