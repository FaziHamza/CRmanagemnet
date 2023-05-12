import { LoginComponent } from './auth/Pages/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: '',
  //   loadChildren: () => import('./auth/auth.module').then(t => t.AuthModule),
  // },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  // {
  //   path: 'auth',
  //   loadChildren: () => import('./auth/auth.module').then(t => t.AuthModule),
  // },
  {
    path: '',
    loadChildren: () => import('./main/main.module').then(t => t.MainModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration : 'enabled'})],
  exports: [RouterModule],
})
export class AppRoutingModule { }
