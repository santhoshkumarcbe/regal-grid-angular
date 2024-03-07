import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentComponent } from './payment/payment.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChatComponent } from './chat/chat.component';
import { SlotComponent } from './slot/slot.component';
import { BookSlotComponent } from './book-slot/book-slot.component';

const routes: Routes = [
  {path:'', component:DashboardComponent},
  {path:'slots', component:SlotComponent},
  {path:'bookslots', component:BookSlotComponent},
  {path:'payment', component:PaymentComponent},
  {path:'chat', component:ChatComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
