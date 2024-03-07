import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';

const routes: Routes = [
  {path:'', component:LoginComponent},
  {path:'register', component:RegisterComponent},
  {path:'forgot-password', component:ForgotPasswordComponent},
  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/admin/admin.module')
        .then((m) => m.AdminModule)
  },
  {
    path: 'customer',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/customer/customer.module')
        .then((m) => m.CustomerModule)
  },
  {
    path: 'dealer',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/dealer/dealer.module')
        .then((m) => m.DealerModule)
  },
  {path:'**', component:NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
