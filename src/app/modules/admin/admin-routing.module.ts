import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChatComponent } from './chat/chat.component';
import { TransactionsComponent } from './transactions/transactions.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  {path:'transactions', component: TransactionsComponent},
  {path: 'chat', component:ChatComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
