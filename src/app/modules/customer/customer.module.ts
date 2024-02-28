import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PaymentComponent } from './payment/payment.component';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ChatComponent } from './chat/chat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DashboardComponent,
    PaymentComponent,
    SidebarComponent,
    ChatComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    HeaderComponent,
    FooterComponent,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [ DatePipe ]
})
export class CustomerModule { }
