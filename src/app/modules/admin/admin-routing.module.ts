import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChatComponent } from './chat/chat.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { RegisterDealerComponent } from './register-dealer/register-dealer.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  {path:'transactions', component: TransactionsComponent},
  {path: 'chat', component:ChatComponent},
  {path: 'register-dealer', component:RegisterDealerComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
