import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './container/auth-layout/auth-layout.component';
import { ConfirmEmailComponent } from './Pages/confirm-email/confirm-email.component';
import { ConfirmNumberComponent } from './Pages/confirm-number/confirm-number.component';
import { ConfirmPasswordComponent } from './Pages/confirm-password/confirm-password.component';
import { LoginComponent } from './Pages/login/login.component';
import { PrivacyPolicyComponent } from './Pages/privacy-policy/privacy-policy/privacy-policy.component';
import { RegisterComponent } from './Pages/register/register.component';
import { RestorePasswordComponent } from './Pages/restore-password/restore-password.component';
import { VerifyPasswordComponent } from './Pages/verify-password/verify-password.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'privacypolicy',
        component: PrivacyPolicyComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'verify-password/:id',
        component: VerifyPasswordComponent,
      },
      {
        path: 'restore-password',
        component: RestorePasswordComponent,
      },
      {
        path: 'confirm-password/:id',
        component: ConfirmPasswordComponent,
      },
      {
        path: 'confirm-number/:id',
        component: ConfirmNumberComponent,
      },
      {
        path: 'confirm-email/:id',
        component: ConfirmEmailComponent,
      },
       {
        path: '',
        redirectTo: 'login', pathMatch: 'full'
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
