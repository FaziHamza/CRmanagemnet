import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthLayoutComponent } from './container/auth-layout/auth-layout.component';
import { LoginComponent } from './Pages/login/login.component';
import { RegisterComponent } from './Pages/register/register.component';
import { RestorePasswordComponent } from './Pages/restore-password/restore-password.component';
import { VerifyPasswordComponent } from './Pages/verify-password/verify-password.component';
import { ConfirmPasswordComponent } from './Pages/confirm-password/confirm-password.component';
import { AuthHeaderComponent } from './container/auth-header/auth-header.component';
import { ConfirmEmailComponent } from './Pages/confirm-email/confirm-email.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrivacyPolicyComponent } from './Pages/privacy-policy/privacy-policy/privacy-policy.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmNumberComponent } from './Pages/confirm-number/confirm-number.component';

@NgModule({
  declarations: [
    AuthLayoutComponent,
    LoginComponent,
    RegisterComponent,
    RestorePasswordComponent,
    VerifyPasswordComponent,
    ConfirmPasswordComponent,
    AuthHeaderComponent,
    ConfirmEmailComponent,
    ConfirmNumberComponent,
    PrivacyPolicyComponent,
    

  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
  ]
})
export class AuthModule { }
