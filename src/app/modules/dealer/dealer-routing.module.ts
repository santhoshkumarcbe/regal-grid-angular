import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { SlotComponent } from "./slot/slot.component";
import { TransactionsComponent } from "./transactions/transactions.component";

const routes: Routes = [
    {path:'', component:DashboardComponent},
    {path:'slots', component: SlotComponent},
    {path:'transactions', component: TransactionsComponent}
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class DealerRoutingModule { }